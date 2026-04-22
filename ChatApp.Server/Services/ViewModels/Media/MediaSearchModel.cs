using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Media
{
    public class MediaSearchModel : BaseSearchModel
    {
        public int? MessageId { get; set; }
        public string? FileType { get; set; }
    }
}
