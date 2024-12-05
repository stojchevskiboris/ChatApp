using ChatApp.Server.Services.ViewModels.Groups;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IGroupUserService
    {
        List<GroupUserViewModel> GetAllGroupUsers();
        List<GroupUserViewModel> GetGroupUsersByGroupId(int groupId);
        GroupUserViewModel GetGroupUserById(int id);
        GroupUserViewModel CreateGroupUser(GroupUserViewModel model);
        bool DeleteUsersByGroupId(int id);
        bool DeleteGroupUser(int id);
    }
}
