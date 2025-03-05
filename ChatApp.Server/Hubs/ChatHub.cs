using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Messages;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IDictionary<string, int> _connection;
        private readonly IUserService _userService;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(IDictionary<string, int> connection, IUserService userService, ILogger<ChatHub> logger)
        {
            _connection = connection;
            _userService = userService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userIdString = httpContext?.Request.Query["userId"];

            if (int.TryParse(userIdString, out int userId))
            {
                _connection[Context.ConnectionId] = userId;
            }

            var currentUser = _userService.GetCurrentUserDetailsOrDefault(userIdString);
            await Clients.AllExcept(Context.ConnectionId).SendAsync("Join", Context.ConnectionId, currentUser);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _connection.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(int userFromId, int userToId, MessageViewModel message)
        {
            var connectionIds = _connection.Where(x => x.Value == userToId).Select(x => x.Key).ToList();
            if (connectionIds.Any())
            {
                await Clients.Clients(connectionIds).SendAsync("ReceiveMessage", userFromId, message);
            }
        }
    }
}