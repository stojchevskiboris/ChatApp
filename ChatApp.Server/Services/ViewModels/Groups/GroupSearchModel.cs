using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Groups
{
    public class GroupSearchModel : BaseSearchModel
    {
        public string? Name { get; set; }
        public int? CreatedByUserId { get; set; }
    }
}
