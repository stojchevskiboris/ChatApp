using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IUserService
    {
        SqlQueryResult ExecuteQuery(string query);
        int GetS();
        int GetD();
        #region UserServices
        List<UserViewModel> GetAllUsers();
        UserViewModel GetUserById(int id);
        UserViewModel GetCurrentUserDetails();
        UserViewModel? GetCurrentUserDetailsOrDefault(string id);
        List<UserViewModel> GetContacts();
        List<int> GetContactIds();
        UserViewModel GetUserByUsername(string username);
        bool RemoveContact(int contactId);
        bool UpdateProfilePicture(string imageUrl, long fileLength, string contentType);
        bool RemoveCurrentProfilePicture();
        bool CheckUsername(string username);
        UserViewModel CreateUser(UserRegisterModel model);
        UserViewModel UpdateUser(UpdateUserViewModel user);
        bool DeleteUser(int id);
        bool ChangePassword(PasswordViewModel user);
        void UpdateLastActive();
        List<LastActiveModel> UpdateContactsLastActive();
        #endregion

        #region AuthenticationServices
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        AuthenticateResponse AuthenticateWithJwt(string token);
        #endregion
    }
}
