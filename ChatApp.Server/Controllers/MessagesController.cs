using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IFirebaseStorageService _firebaseStorageService;


        public MessagesController(IMessageService messageService, IFirebaseStorageService firebaseStorageService)
        {
            _messageService = messageService;
            _firebaseStorageService = firebaseStorageService;
        }

        [HttpPost("SearchMessages")]
        [Authorize]
        public List<MessageViewModel> SearchMessages(MessageSearchModel model)
        {
            if (string.IsNullOrEmpty(model.Query))
            {
                return new List<MessageViewModel>();
            }
            return _messageService.SearchMessages(model);
        }

        [HttpPost("SendMessage")]
        [Authorize]
        public bool SendMessage(MessageViewModel model)
        {
            var result = _messageService.SendMessage(model);

            return result;
        }

        [HttpPost("UploadMedia")]
        [Authorize]
        public async Task<IActionResult> UploadMedia([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                var imageUrl = await _firebaseStorageService.UploadMediaFileAsync(file);
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, "Failed to upload media");
                }

                return Ok(new
                {
                    url = imageUrl,
                    contentType = file.ContentType,
                    fileLength = file.Length
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UploadGif")]
        [Authorize]
        public async Task<IActionResult> UploadGif(HttpRequestQueryModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Query))
                {
                    return BadRequest("No file uploaded");
                }

                var gif = await _firebaseStorageService.UploadGifFileAsync(model.Query);
                if (string.IsNullOrEmpty(gif.Url))
                {
                    return StatusCode(500, "Failed to upload gif");
                }

                return Ok(new { 
                    url = gif.Url,
                    contentType = "image/gif",
                    fileLength = gif.FileSize
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetRecentChats")]
        [Authorize]
        public List<RecentChatViewModel> GetRecentChats(HttpRequestQueryModel model)
        {
            var result = _messageService.GetRecentChats(model.Query);

            return result;
        }

        [HttpPost("SetMessageSeen")]
        [Authorize]
        public bool SetMessageSeen(HttpRequestIdModel model)
        {
            var result = _messageService.SetMessageSeen(model.Id);

            return result;
        }

        [HttpPost("GetRecentMessages")]
        [Authorize]
        public MessagesChatModel GetRecentMessages(HttpRequestIdModel model)
        {
            if (model.Id == 0)
            {
                return new MessagesChatModel();
            }
            return _messageService.GetRecentMessages(model.Id);
        }

        [HttpPost("FetchOlderMessages")]
        [Authorize]
        public MessagesChatModel FetchOlderMessages(MessagesHttpRequest model)
        {
            if (model.OldestMessageId == 0 || model.OldestMessageId == -1 || model.RecipientId == 0)
            {
                return new MessagesChatModel();
            }
            return _messageService.FetchOlderMessages(model);
        }

        [HttpPost("FetchMessagesNewerThanMessageId")]
        [Authorize]
        public MessagesChatModel FetchMessagesNewerThanMessageId(MessagesHttpRequest model)
        {
            if (model.OldestMessageId == 0 || model.OldestMessageId == -1 || model.RecipientId == 0)
            {
                return new MessagesChatModel();
            }
            return _messageService.FetchMessagesNewerThanMessageId(model);
        }

        [HttpPost("GetSharedMedia")]
        [Authorize]
        public List<SharedMediaViewModel> GetSharedMedia(HttpRequestIdModel model)
        {
            if (model.Id == 0)
            {
                return new List<SharedMediaViewModel>();
            }
            return _messageService.GetSharedMedia(model.Id);
        }
    }
}