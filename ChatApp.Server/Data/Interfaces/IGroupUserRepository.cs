using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IGroupUserRepository : IRepository<GroupUser>
    {
        public List<GroupUser> GetAllGroupUsers();
        public List<GroupUser> GetByGroupId(int groupId);
    }
}
