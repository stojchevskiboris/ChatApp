using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IAdminRepository
    {
        #region Users
        User GetUserById(int userId);
        List<User> SearchUsers(UserSearchModel searchModel);
        IQueryable<User> UsersQueryable();
        byte[] ExportUsers(UserSearchModel model);
        #endregion

        #region Groups
        IQueryable<Group> GroupsQueryable();
        Group GetGroupById(int id);
        bool DeleteGroup(int id);
        #endregion

        #region GroupUsers
        IQueryable<GroupUser> GroupUsersQueryable();
        GroupUser GetGroupUserById(int id);
        bool DeleteGroupUser(int id);
        #endregion

        #region Messages
        IQueryable<Message> MessagesQueryable();
        Message GetMessageById(int id);
        bool DeleteMessage(int id);
        #endregion

        #region Media
        IQueryable<Media> MediaQueryable();
        Media GetMediaById(int id);
        bool DeleteMedia(int id);
        #endregion

        #region Recipients
        IQueryable<Recipient> RecipientsQueryable();
        Recipient GetRecipientById(int id);
        bool DeleteRecipient(int id);
        #endregion

        #region Requests
        IQueryable<Request> RequestsQueryable();
        Request GetRequestById(int id);
        bool DeleteRequest(int id);
        #endregion
    }
}
