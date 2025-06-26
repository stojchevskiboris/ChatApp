using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IAdminService
    {
        UserRoleViewModel GetCurrentUserRole();
    }
}
