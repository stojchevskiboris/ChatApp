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
    }
}
