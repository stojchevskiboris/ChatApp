using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Messages;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;
        

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
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

        [HttpPost("GetRecentMessages")]
        [Authorize]
        public List<RecentMessageViewModel> GetRecentMessages(HttpRequestQueryModel model)
        {
            var result = _messageService.GetRecentMessages(model.Query);

            return result;
        }

        [HttpPost("SetMessageSeen")]
        [Authorize]
        public bool SetMessageSeen(HttpRequestIdModel model)
        {
            var result = _messageService.SetMessageSeen(model.Id);

            return result;
        }
    }
}