using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Giphy;

namespace ChatApp.Server.Services.Implementations
{
    public class GiphyService : IGiphyService
    {
        private readonly HttpClient _httpClient;

        public GiphyService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<GifModel>> FetchGifsAsync(GifRequest request)
        {
            var apiKey = "vq2dOIBN7NyirxxkmVGuZSi8EE1xgnll";
            var giphyUrl = $"https://api.giphy.com/v1/gifs/search?q={request.Query}&limit={request.Limit}&api_key={apiKey}";

            var response = await _httpClient.GetFromJsonAsync<GiphyApiResponse>(giphyUrl);

            if (response?.Data == null)
                return Enumerable.Empty<GifModel>();

            return response.Data.Select(gif => new GifModel
            {
                Id = gif.Id,
                Title = gif.Title,
                Url = gif.Images.Original.Url,
                ThumbnailUrl = gif.Images.Preview.Url
            });
        }
    }
}
