using ChatApp.Server.Services.ViewModels.Giphy;

namespace ChatApp.Server.Services.Mappers
{
    public static class GiphyMapper
    {
        public static GifViewModel MapToViewModel(this GiphyData model)
        {
            if (model == null)
                return null;

            return new GifViewModel
            {
                Id = model.Id,
                Title = model.Title,
                ImageUrl = model.Images.Original.Url,
                PreviewUrl = model.Images.Preview.Url
            };
        }

        public static List<GifViewModel> MapToViewModelList(this List<GiphyData> gifs)
        {
            return gifs.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
