using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IAdminService
    {
        #region Users
        UserRoleViewModel GetCurrentUserRole();
        PagedResult<UserViewModel> SearchUsers(UserSearchModel model);
        UserViewModel GetUserById(int userId);
        UserViewModel SaveOrUpdateUser(UserRegisterModel model);
        bool DeleteUser(int userId);
        byte[] ExportUsers(UserSearchModel model);
        #endregion

        #region Messages
        PagedResult<MessageAdminViewModel> SearchMessages(MessageAdminSearchModel model);
        MessageAdminViewModel GetMessageById(int userId);
        MessageAdminViewModel SaveOrUpdateMessage(MessageViewModel model);
        bool DeleteMessage(int messageId);
        byte[] ExportMessages(MessageAdminSearchModel model);
        #endregion

        #region QueryEditor
        SqlQueryResult ExecuteQuery(string query);
        #endregion
    }
}
