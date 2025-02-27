using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Media;

namespace ChatApp.Server.Services.Mappers
{
    public static class MediaMapper
    {
        public static MediaViewModel MapToViewModel(this Media media)
        {
            if (media == null)
                return null;

            var model = new MediaViewModel
            {
                Id = media.Id,
                MessageId = media.MessageId,
                Url = media.Url,
                FileType = media.FileType,
                FileSize = media.FileSize,
                CreatedAt = media.CreatedAt,
                ModifiedAt = media.ModifiedAt
            };

            return model;
        }

        public static List<MediaViewModel> MapToViewModelList(this List<Media> mediaList)
        {
            return mediaList.Select(x => x.MapToViewModel()).ToList();
        }

        public static SharedMediaViewModel MapToSharedMediaModel(this Message message)
        {
            if (message == null)
                return null;

            var model = new SharedMediaViewModel
            {
                Id = message?.Id ?? 0,
                Url = message?.MediaContent?.Url ?? string.Empty,
                FileType = message?.MediaContent?.FileType ?? string.Empty,
                FileSize = message?.MediaContent?.FileSize ?? 0,
                SentFromFirstName = message?.Sender?.FirstName ?? string.Empty,
                SentFromLastName = message?.Sender?.LastName ?? string.Empty,
                SentFromUsername = message?.Sender?.Username ?? string.Empty,
                SentFromId = message?.Sender?.Id ?? 0,
                SentToFirstName = message?.Recipient?.RecipientUser?.FirstName ?? string.Empty,
                SentToLastName = message?.Recipient?.RecipientUser?.LastName ?? string.Empty,
                SentToUsername = message?.Recipient?.RecipientUser?.Username ?? string.Empty,
                SentToId = message?.Recipient?.RecipientUser?.Id ?? 0,
                CreatedAt = message.CreatedAt,
                ModifiedAt = message.ModifiedAt
            };

            return model;
        }

        public static List<SharedMediaViewModel> MapToSharedMediaModelList(this List<Message> messageList)
        {
            return messageList.Select(x => x.MapToSharedMediaModel()).ToList();
        }
    }
}
