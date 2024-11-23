using ChatApp.Server.Services.ViewModels.Giphy;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IGiphyService
    {
        Task<IEnumerable<GifModel>> FetchGifsAsync(GifRequest request);
    }
}
