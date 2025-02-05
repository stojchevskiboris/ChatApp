using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Groups;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Mappers
{
    public static class MessageMapper
    {
        public static RecentChatViewModel MapToRecentMessageModel(this Message message)
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

        public static List<RecentChatViewModel> MapToRecentMessagesModelList(this List<Message> messages)
        {
            return messages.Select(x => x.MapToRecentMessageModel()).ToList();
        }
    }
}
