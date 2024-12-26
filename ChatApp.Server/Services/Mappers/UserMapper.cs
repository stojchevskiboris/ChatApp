using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Services.Mappers
{
    public static class UserMapper
    {
        public static UserViewModel MapToViewModel(this User user)
        {
            if (user == null)
                return null;

            var model = new UserViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                ModifiedAt = user.ModifiedAt
            };

            if (user.Contacts.Any())
            {
                model.ContactsId = user.Contacts.Select(x => x.ContactId).ToList();
            }

            return model;
        }

        public static List<UserViewModel> MapToViewModelList(this List<User> users)
        {
            return users.Select(x => x.MapToViewModel()).ToList();
        }

        public static AddUserModel MapToAddUserModel(this User user)
        {
            if (user == null)
                return null;

            return new AddUserModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                //Phone = user.Phone,
                //DateOfBirth = user.DateOfBirth
            };
        }

        public static List<AddUserModel> MapToAddUserModelList(this List<User> users)
        {
            return users.Select(x => x.MapToAddUserModel()).ToList();
        }
    }
}