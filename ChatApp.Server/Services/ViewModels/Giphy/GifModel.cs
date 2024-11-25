namespace ChatApp.Server.Services.ViewModels.Giphy
{
    public class GifModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }
    }

    public class GiphyApiResponse
    {
        public List<GiphyData> Data { get; set; }
    }

    public class GiphyData
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public GiphyImages Images { get; set; }
    }

    public class GiphyImages
    {
        public GiphyImage Original { get; set; }
        public GiphyImage Preview { get; set; }
    }

    public class GiphyImage
    {
        public string Url { get; set; }
    }

    public class GifRequest
    {
        public string Query { get; set; }
        public int Limit { get; set; } = 10;
        public string Rating { get; set; } = "g";
    }
}
