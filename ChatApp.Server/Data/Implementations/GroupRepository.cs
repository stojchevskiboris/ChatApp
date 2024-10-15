using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Data.Implementations
{
    public class GroupRepository : Repository<Group>, IGroupRepository
    {
        private readonly ChatAppDbContext _context;

        public GroupRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
