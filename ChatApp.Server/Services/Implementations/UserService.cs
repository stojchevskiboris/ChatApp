using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels;
using System.Linq;

namespace ChatApp.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public UserViewModel CreateUser(UserViewModel model)
        {
            if(_userRepository.GetAll().Where(x => x.Email == model.Email).Any())
            {
                throw new CustomException("There is already registered user with the provided Email");
            }            

            User user = new User();
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.Password = PasswordHelper.HashPassword(model.Password);
            user.DateOfBirth = model.DateOfBirth;
            user.CreatedAt = DateTime.Now;
            user.ModifiedAt = DateTime.Now;

            var newUser = _userRepository.Create(user);
            return newUser.MapToViewModel();
        }

        public bool DeleteUser(int id)
        {
            throw new NotImplementedException();
        }

        public List<UserViewModel> GetAllUsers()
        {
            return _userRepository.GetAll()
                .ToList()
                .MapToViewModelList();
        }

        public UserViewModel GetUserByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public UserViewModel GetUserById(int id)
        {
            throw new NotImplementedException();
        }

        public bool UpdateUser(UserViewModel user)
        {
            throw new NotImplementedException();
        }
    }
}
