using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Mappers
{
    public static class UserMapper
    {
        public static UserViewModel MapToViewModel(this User user)
        {
            if (user == null)
                return null;

            return new UserViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                ModifiedAt = user.ModifiedAt
            };
        }

        public static List<UserViewModel> MapToViewModelList(this List<User> users)
        {
            return users.Select(x => x.MapToViewModel()).ToList();
        }
    }
}
