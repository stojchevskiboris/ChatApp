using ChatApp.Server.Common.Constants;
using ChatApp.Server.Configs.Authentication.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Giphy;
using Microsoft.Extensions.Options;
using Serilog;

namespace ChatApp.Server.Services.Implementations
{
    public class GiphyService : IGiphyService
    {
        private readonly HttpClient _httpClient;
        private readonly AppSettings _appSettings;

        public GiphyService(HttpClient httpClient, IOptions<AppSettings> appSettings)
        {
            _httpClient = httpClient;
            _appSettings = appSettings.Value;
        }

        public async Task<IEnumerable<GifViewModel>> FetchGifsAsync(GifRequest request)
        {
            var apiKey = _appSettings.GiphyApiKey;
            if (string.IsNullOrEmpty(apiKey))
            {
                Log.Error("Unable to fetch giphy api key from appSettings.");
                return Enumerable.Empty<GifViewModel>();
            }
            string giphyUrl = AppParameters.GiphyApiURL(request.Query, request.Limit, request.Rating, apiKey);

            var response = await _httpClient.GetFromJsonAsync<GiphyApiResponse>(giphyUrl);

            if (response?.Data == null || !response.Data.Any())
                return Enumerable.Empty<GifViewModel>();

            var gifs = response.Data.MapToViewModelList();

            return gifs;
        }
    }
}
