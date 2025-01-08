using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        User GetByUsername(string username);
        List<int> GetContactsByUserId(int currentUserId);
        List<User> SearchUsersToAdd(int currentUserId, string query, List<int> userContactIds);
        bool HasInContacts(User user, int contactId);
    }
}
