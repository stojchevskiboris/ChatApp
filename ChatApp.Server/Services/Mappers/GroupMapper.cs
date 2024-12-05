using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Groups;

namespace ChatApp.Server.Services.Mappers
{
    public static class GroupMapper
    {
        public static GroupViewModel MapToViewModel(this Group group)
        {
            if (group == null)
                return null;

            var model = new GroupViewModel
            {
                Id = group.Id,
                Name = group.Name,
                CreatedByUser = group.CreatedByUser?.MapToViewModel(),
                CreatedAt = group.CreatedAt,
                ModifiedAt = group.ModifiedAt
            };

            if (group.GroupUsers.Any())
            {
                model.GroupUsersId = group.GroupUsers.Select(x => x.UserId).ToList();
            }

            return model;
        }

        public static List<GroupViewModel> MapToViewModelList(this List<Group> groups)
        {
            return groups.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
