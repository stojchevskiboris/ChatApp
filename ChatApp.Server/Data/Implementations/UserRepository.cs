using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ChatAppDbContext _context;

        public UserRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public User GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public IEnumerable<User> SearchUsersToAdd(int currentUserId, string query, List<int> contactIds)
        {
            var terms = query.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            // ToDo: fix search algorithm ("Testuser St" returns results without containing Testuser because of the St)
            return _context.Users.Where(
                u => u.Id != currentUserId &&
                !contactIds.Contains(u.Id) &&
                terms.Any(term =>
                    u.FirstName.ToLower().Contains(term) ||
                    u.LastName.ToLower().Contains(term)
                )
            );
        }

        public bool HasInContacts(User user, int contactId)
        {
            if (user.Contacts.Any())
            {
                //return user.Contacts.Select(x => x.ContactId == contactId).Any();
                return user.Contacts.Any(x => x.ContactId == contactId);
            }
            return false;
        }
    }
}
