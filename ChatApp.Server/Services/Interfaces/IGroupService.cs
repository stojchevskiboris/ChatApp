using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IGroupService
    {
        List<GroupViewModel> GetAllGroups();
        GroupViewModel GetGroupById(int id);
        //List<GroupViewModel> GetGroupsByUserId(int id); // ova e za vo groupUsers
        GroupViewModel CreateGroup(GroupViewModel model);
        GroupViewModel UpdateGroup(GroupViewModel user);
        bool DeleteGroup(int id);
    }
}
