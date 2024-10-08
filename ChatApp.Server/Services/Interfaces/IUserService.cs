using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IUserService
    {
        List<UserViewModel> GetAllUsers();
        UserViewModel GetUserById(int id);
        UserViewModel GetUserByEmail(string email);
        UserViewModel CreateUser(UserViewModel model);
        UserViewModel UpdateUser(UserViewModel user);
        bool DeleteUser(int id);
        bool ChangePassword(PasswordViewModel user);
    }
}
