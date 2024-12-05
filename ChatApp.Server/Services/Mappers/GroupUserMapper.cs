using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Groups;

namespace ChatApp.Server.Services.Mappers
{
    public static class GroupUserMapper
    {
        public static GroupUserViewModel MapToViewModel(this GroupUser groupUser)
        {
            if (groupUser == null)
                return null;

            return new GroupUserViewModel
            {
                Id = groupUser.Id,
                UserId = groupUser.User.Id,
                GroupId = groupUser.Group.Id,
                CreatedAt = groupUser.CreatedAt,
                ModifiedAt = groupUser.ModifiedAt
            };
        }

        public static List<GroupUserViewModel> MapToViewModelList(this List<GroupUser> groupUsers)
        {
            return groupUsers.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
