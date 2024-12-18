using ChatApp.Server.Services.ViewModels.Requests;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IRequestService
    {
        List<RequestViewModel> GetAllRequests();
        List<AddUserModel> SearchUsersToAdd(string query);
        List<RequestDetailsModel> GetPendingRequests();
        List<RequestDetailsModel> GetArchivedRequests();
        int GetRequestsCount();
        bool NewRequest(int userId);
        bool CancelRequest(int id);
        bool AcceptRequest(int id);
        bool RejectRequest(int id);
    }
}
