﻿using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IMessageService
    {
        List<MessageViewModel> SearchMessages(MessageSearchModel model);
        int SendMessage(MessageViewModel model);
        List<RecentChatViewModel> GetRecentChats(string searchQuery);
        bool SetMessageSeen(int messageId);
        bool DeleteMessage(int messageId);
        MessagesChatModel GetRecentMessages(int recipientId);
        MessagesChatModel FetchOlderMessages(MessagesHttpRequest model);
        MessagesChatModel FetchMessagesNewerThanMessageId(MessagesHttpRequest model);
        List<SharedMediaViewModel> GetSharedMedia(int recipientId);
    }
}