using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Data.Implementations
{
    public class GroupUserRepository : Repository<GroupUser>, IGroupUserRepository
    {
        private readonly ChatAppDbContext _context;

        public GroupUserRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public List<GroupUser> GetAllGroupUsers()
        {
            return _context.GroupUsers
                //.Include(gu => gu.User)  // Eager load the User entity
                //.Include(gu => gu.Group) // Eager load the Group entity
                .ToList();
        }

        public List<GroupUser> GetByGroupId(int groupId)
        {
            return _context.GroupUsers
                //.Include(gu => gu.User)  // Eager load the User entity
                //.Include(gu => gu.Group) // Eager load the Group entity
                .Where(gu => gu.Group.Id == groupId)
                .ToList();
        }
    }
}
