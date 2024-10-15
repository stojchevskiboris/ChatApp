using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IGroupUserService
    {
        List<GroupUserViewModel> GetGroupUsers(int groupId);
        GroupUserViewModel CreateGroupUser(GroupUserViewModel model);
        bool DeleteUsersByGroupId(int id);
        bool DeleteGroupUser(int id);
    }
}
