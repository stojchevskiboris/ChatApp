using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Groups
{
    public class GroupUserSearchModel : BaseSearchModel
    {
        public int? GroupId { get; set; }
        public int? UserId { get; set; }
    }
}
