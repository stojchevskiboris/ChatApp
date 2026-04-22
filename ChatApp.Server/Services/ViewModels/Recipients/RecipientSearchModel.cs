using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Recipients
{
    public class RecipientSearchModel : BaseSearchModel
    {
        public int? RecipientTypeId { get; set; }
    }
}
