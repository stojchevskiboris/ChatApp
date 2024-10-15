using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Mappers
{
    public static class GroupMapper
    {
        public static GroupViewModel MapToViewModel(this Group group)
        {
            if (group == null)
                return null;

            return new GroupViewModel
            {
                Id = group.Id,
                Name = group.Name,
                CreatedByUser = group.CreatedByUser?.MapToViewModel(),
                CreatedAt = group.CreatedAt,
                ModifiedAt = group.ModifiedAt
            };
        }

        public static List<GroupViewModel> MapToViewModelList(this List<Group> groups)
        {
            return groups.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
