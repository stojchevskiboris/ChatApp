using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IMessageService
    {
        List<MessageViewModel> SearchMessages(MessageSearchModel model);
        bool SendMessage(MessageViewModel model);
        List<RecentChatViewModel> GetRecentChats(string searchQuery);
        bool SetMessageSeen(int messageId);
        MessagesChatModel GetRecentMessages(int recipientId);
        MessagesChatModel FetchOlderMessages(MessagesHttpRequest model);
        MessagesChatModel FetchMessagesNewerThanMessageId(MessagesHttpRequest model);
        List<SharedMediaViewModel> GetSharedMedia(int recipientId);
    }
}