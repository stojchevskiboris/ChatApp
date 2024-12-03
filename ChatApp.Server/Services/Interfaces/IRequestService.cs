using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IRequestService
    {
        List<RequestViewModel> GetAllRequests();
        bool RequestByUserId(NewRequestModel model);
        bool CancelRequestById(int id);
        bool ApproveRequestById(int id);
        bool RejectRequestById(int id);
    }
}
