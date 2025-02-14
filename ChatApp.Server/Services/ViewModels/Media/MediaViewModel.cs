namespace ChatApp.Server.Services.ViewModels.Media
{
    public class MediaViewModel
    {
        public int Id { get; set; }

        public int? MessageId { get; set; }

        public string Url { get; set; }

        public string FileType { get; set; }

        public int FileSize { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}