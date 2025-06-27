using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Data.Implementations
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ChatAppDbContext _context;

        public AdminRepository(ChatAppDbContext context)
        {
            _context = context;
        }

        public User GetUserById(int userId)
        {
            throw new NotImplementedException();
        }

        public List<User> SearchUsers(UserSearchModel searchModel)
        {
            throw new NotImplementedException();
        }
    }
}
