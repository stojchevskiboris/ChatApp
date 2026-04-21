using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class AdminMessageSearchModel : BaseSearchModel
    {
        public int? SenderId { get; set; }
        public string? Content { get; set; }
        public bool? IsSeen { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
