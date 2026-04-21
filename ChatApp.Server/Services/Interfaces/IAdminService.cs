using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Groups;
using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Recipients;
using ChatApp.Server.Services.ViewModels.Requests;
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

        #region Groups
        PagedResult<GroupViewModel> SearchGroups(GroupSearchModel model);
        GroupViewModel GetGroupById(int id);
        GroupViewModel SaveOrUpdateGroup(SaveGroupModel model);
        bool DeleteGroup(int id);
        #endregion

        #region GroupUsers
        PagedResult<GroupUserViewModel> SearchGroupUsers(GroupUserSearchModel model);
        GroupUserViewModel GetGroupUserById(int id);
        GroupUserViewModel SaveGroupUser(SaveGroupUserModel model);
        bool DeleteGroupUser(int id);
        #endregion

        #region Messages
        PagedResult<AdminMessageViewModel> SearchMessages(AdminMessageSearchModel model);
        AdminMessageViewModel GetMessageById(int id);
        bool DeleteMessage(int id);
        #endregion

        #region Media
        PagedResult<MediaViewModel> SearchMedia(MediaSearchModel model);
        MediaViewModel GetMediaById(int id);
        bool DeleteMedia(int id);
        #endregion

        #region Recipients
        PagedResult<RecipientViewModel> SearchRecipients(RecipientSearchModel model);
        RecipientViewModel GetRecipientById(int id);
        bool DeleteRecipient(int id);
        #endregion

        #region Requests
        PagedResult<RequestViewModel> SearchRequests(RequestSearchModel model);
        RequestViewModel GetRequestById(int id);
        RequestViewModel UpdateRequest(UpdateRequestModel model);
        bool DeleteRequest(int id);
        #endregion

        #region Roles
        PagedResult<UserAdminModel> SearchRoles(RoleSearchModel model);
        bool UpdateUserRole(RoleUpdateModel model);
        #endregion

        #region QueryEditor
        SqlQueryResult ExecuteQuery(string query);
        #endregion
    }
}
