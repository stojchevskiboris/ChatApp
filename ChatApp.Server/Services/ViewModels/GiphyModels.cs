namespace ChatApp.Server.Services.ViewModels
{
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
        public OriginalImageUrl Original { get; set; }
        public PreviewImageUrl Fixed_Height_Downsampled { get; set; }
    }

    public class OriginalImageUrl
    {
        public string Url { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
    }

    public class PreviewImageUrl
    {
        public string Url { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
    }

    public class GifRequest
    {
        public string Query { get; set; }
        public int Limit { get; set; } = 10;
        public string Rating { get; set; } = "g";
    }
}
