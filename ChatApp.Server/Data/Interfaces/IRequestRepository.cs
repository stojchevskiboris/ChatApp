using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IRequestRepository : IRepository<Request>
    {
        public bool HasExistingActiveRequest(int userFromId, int userToId);
        public List<Request> GetPendingRequestsSentFromCurrentUser(int currentUserId);
        public List<Request> GetPendingRequests(int currentUserId);
        public List<Request> GetArchivedRequests(int currentUserId);
        public List<Request> GetByUserIds(int userFromId, int userToId);
    }
}
