using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Requests;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private static readonly List<MessageViewModel> _messages = new()
        {
            new MessageViewModel
            {
                Id = 1,
                SenderId = 101,
                RecipientId = 201,
                Content = "Hello, how are you?",
                HasMedia = false,
                IsSeen = true,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-15)
            },
            new MessageViewModel
            {
                Id = 2,
                SenderId = 101,
                RecipientId = 201,
                Content = "Are we still on for the meeting?",
                HasMedia = false,
                IsSeen = false,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-10),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-10)
            },
            new MessageViewModel
            {
                Id = 3,
                SenderId = 201,
                RecipientId = 101,
                Content = "Yes, I'll be there at 3 PM.",
                HasMedia = false,
                IsSeen = true,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new MessageViewModel
            {
                Id = 4,
                SenderId = 101,
                RecipientId = 301,
                Content = "This is unrelated to the current recipient.",
                HasMedia = false,
                IsSeen = false,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-20),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-20)
            }
        };

        public MessagesController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpPost("SearchMessages")]
        [Authorize]
        public List<MessageViewModel> SearchMessages(MessageSearchModel model)
        {
            if (string.IsNullOrEmpty(model.Query))
            {
                return new List<MessageViewModel>();
            }
            return _messages;

        }
    }
}