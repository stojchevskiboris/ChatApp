using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IUserService
    {
        #region UserServices
        List<UserViewModel> GetAllUsers();
        UserViewModel GetUserById(int id);
        UserViewModel GetUserByEmail(string email);
        List<AddUserModel> SearchUsers(string query);
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
