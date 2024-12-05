using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IRequestService
    {
        List<RequestViewModel> GetAllRequests();
        List<AddUserModel> SearchUsersToAdd(string query);
        List<AddUserModel> GetPendingRequests();
        bool NewRequest(int userId);
        bool CancelRequest(int id);
        bool ApproveRequest(int id);
        bool RejectRequest(int id);
    }
}
