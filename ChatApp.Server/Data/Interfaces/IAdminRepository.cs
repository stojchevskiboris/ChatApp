using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IAdminRepository
    {
        #region Users
        User GetUserById(int userId);
        List<User> SearchUsers(UserSearchModel searchModel);
        #endregion


    }
}
