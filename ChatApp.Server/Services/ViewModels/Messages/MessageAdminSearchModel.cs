using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class MessageAdminSearchModel : BaseSearchModel
    {
        public string? SenderUsername { get; set; }
        public int? SenderId { get; set; }
        public string? RecipientUsername { get; set; }
        public int? RecipientId { get; set; }
        public string? Content { get; set; }
        public int? SeenStatus { get; set; }
        public int? DeletedStatus { get; set; }
        public int? HasMediaStatus { get; set; }
    }
}
