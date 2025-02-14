using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Mappers
{
    public static class MessageMapper
    {
        public static RecentChatViewModel MapToRecentChatModel(this Message message)
        {
            if (message == null)
                return null;

            var model = new RecentChatViewModel
            {
                Id = message.Id,
                RecipientId = message.Recipient?.RecipientUser?.Id ?? 0,
                RecipientFirstName = message.Recipient?.RecipientUser?.FirstName ?? "",
                RecipientLastName = message.Recipient?.RecipientUser?.LastName ?? "",
                Content = message.Content ?? "",
                HasMedia = message.HasMedia,
                IsSeen = message.IsSeen,
                ParentMessageId = message.ParentMessage?.Id,
                CreatedAt = message.CreatedAt,
                ModifiedAt = message.ModifiedAt
            };

            return model;
        }

        public static List<RecentChatViewModel> MapToRecentChatsModelList(this List<Message> messages)
        {
            return messages.Select(x => x.MapToRecentChatModel()).ToList();
        }

        public static MessageViewModel MapToViewModel(this Message message)
        {
            if (message == null)
                return null;

            var model = new MessageViewModel
            {
                Id = message.Id,
                RecipientId = message.Recipient?.RecipientUser?.Id ?? 0,
                SenderId = message.Sender?.Id ?? 0,
                Content = message.Content ?? "",
                HasMedia = message.HasMedia,
                Media = message.MediaContent?.MapToViewModel(),
                IsSeen = message.IsSeen,
                ParentMessage = message.ParentMessage?.Id,
                CreatedAt = message.CreatedAt,
                ModifiedAt = message.ModifiedAt
            };

            return model;
        }

        public static List<MessageViewModel> MapToViewModelList(this List<Message> messages)
        {
            return messages.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
