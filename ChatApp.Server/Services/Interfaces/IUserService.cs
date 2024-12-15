using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IUserService
    {
        #region UserServices
        List<UserViewModel> GetAllUsers();
        UserViewModel GetUserById(int id);
        List<UserViewModel> GetContacts();
        UserViewModel GetUserByEmail(string email);
        bool RemoveContact(int contactId);
        UserViewModel CreateUser(UserRegisterModel model);
        UserViewModel UpdateUser(UserViewModel user);
        bool DeleteUser(int id);
        bool ChangePassword(PasswordViewModel user);
        #endregion

        #region AuthenticationServices
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        AuthenticateResponse AuthenticateWithJwt(string token);
        #endregion
    }
}
