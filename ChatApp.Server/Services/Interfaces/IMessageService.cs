using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IMessageService
    {
        List<MessageViewModel> SearchMessages(MessageSearchModel model);
        bool SendMessage(MessageViewModel model);
        List<RecentChatViewModel> GetRecentChats(string searchQuery);
        bool SetMessageSeen(int messageId);
        List<MessageViewModel> GetRecentMessages(int recipientId);
    }
}