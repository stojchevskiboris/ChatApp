using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        User GetByEmail(string email);
        IEnumerable<User> SearchUsersToAdd(int currentUserId, string query);
        bool HasInContacts(User user, int contactId);
    }
}
