using ChatApp.Server.Controllers;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Messages;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;

        public ChatHub(IUserService userService)
        {
            _userService = userService;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Request.Query["userId"];
            var currentUser = _userService.GetCurrentUserDetailsOrDefault(userId);
            await Clients.AllExcept(Context.ConnectionId).SendAsync("Join", Context.ConnectionId, currentUser);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, MessageViewModel message)
        {
            Clients.All.SendAsync("ReceiveMessage", user, message);

            Clients.User("1").SendAsync("ReceiveMessage", message);
        }
    }
}
