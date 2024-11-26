using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Giphy;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiphyController : ControllerBase
    {
        private readonly IGiphyService _giphyService;

        public GiphyController(IGiphyService giphyService)
        {
            _giphyService = giphyService;
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] GifRequest request)
        {
            if (string.IsNullOrEmpty(request.Query))
                return BadRequest("Query parameter is required.");

            var gifs = await _giphyService.FetchGifsAsync(request);

            return Ok(gifs);
        }
    }
}