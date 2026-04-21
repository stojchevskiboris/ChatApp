using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Requests
{
    public class RequestSearchModel : BaseSearchModel
    {
        public int? UserFromId { get; set; }
        public int? UserToId { get; set; }
        public int? RequestStatus { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
