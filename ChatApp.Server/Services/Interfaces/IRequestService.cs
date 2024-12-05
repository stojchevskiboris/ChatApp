using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IRequestService
    {
        List<RequestViewModel> GetAllRequests();
        List<AddUserModel> SearchUsersToAdd(string query);
        List<AddUserModel> GetPendingRequests();
        List<AddUserModel> GetArchivedRequests();
        bool NewRequest(int userId);
        bool CancelRequest(int id);
        bool AcceptRequest(int id);
        bool RejectRequest(int id);
    }
}
