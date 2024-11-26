using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IGiphyService
    {
        Task<IEnumerable<GifViewModel>> FetchGifsAsync(GifRequest request);
    }
}
