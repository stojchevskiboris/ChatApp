using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IAdminRepository
    {
        #region Users
        User GetUserById(int userId);
        #endregion
    }
}
