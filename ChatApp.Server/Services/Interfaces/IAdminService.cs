using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IAdminService
    {
        #region Users
        UserRoleViewModel GetCurrentUserRole();
        #endregion

        #region QueryEditor
        SqlQueryResult ExecuteQuery(string query);
        #endregion
    }
}
