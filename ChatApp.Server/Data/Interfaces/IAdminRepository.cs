using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Messages;
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

        #region Messages
        Message GetMessageById(int messageId);
        List<Message> SearchMessages(MessageAdminSearchModel searchModel);
        IQueryable<Message> MessagesQueryable();
        byte[] ExportMessages(MessageAdminSearchModel model);
        #endregion
    }
}
