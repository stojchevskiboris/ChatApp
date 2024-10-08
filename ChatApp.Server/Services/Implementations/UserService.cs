using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels;

namespace ChatApp.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<UserViewModel> GetAllUsers()
        {
            return _userRepository.GetAll()
                .ToList()
                .MapToViewModelList();
        }

        public UserViewModel GetUserById(int id)
        {
            var user = GetUserDomainById(id);

            return user.MapToViewModel();
        }

        public UserViewModel GetUserByEmail(string email)
        {
            var user = _userRepository.GetByEmail(email.Trim());
            if (user == null)
            {
                throw new CustomException($"No user found with email: {email}");
            }

            return user.MapToViewModel();
        }

        public UserViewModel CreateUser(UserViewModel model)
        {
            if (_userRepository.GetAll().Where(x => x.Email == model.Email).Any())
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

        public UserViewModel UpdateUser(UserViewModel model)
        {
            var user = GetUserDomainById(model.Id);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.DateOfBirth = model.DateOfBirth;
            user.ModifiedAt = DateTime.Now;

            _userRepository.Update(user);

            return user.MapToViewModel();
        }

        public bool DeleteUser(int id)
        {
            var user = GetUserDomainById(id);
            _userRepository.Delete(id);

            user = _userRepository.Get(id);
            if (user == null)
            {
                return true;
            }

            return false;
        }

        public bool ChangePassword(PasswordViewModel model)
        {
            if (model == null)
            {
                throw new CustomException("Invalid parameters");
            }

            if(string.IsNullOrEmpty(model.OldPassword) 
                || string.IsNullOrEmpty(model.NewPassword) 
                || string.IsNullOrEmpty(model.ConfirmPassword))
            {
                throw new CustomException("Invalid parameters");
            }

            if(model.NewPassword != model.ConfirmPassword)
            {
                throw new CustomException("Passwords do not match!");
            }

            if (!PasswordHelper.CheckPasswordStrength(model.NewPassword))
            {
                throw new CustomException("Passwords must contain at least 8 characters!");
            }

            var user = GetUserDomainById(model.UserId);

            var hashedOldPassword = user.Password;
            var hashedNewPassword = PasswordHelper.HashPassword(model.NewPassword);
            
            if(hashedOldPassword == hashedNewPassword)
            {
                throw new CustomException("New password cannot be same as old password!");
            }

            user.Password = hashedNewPassword;
            _userRepository.Update(user);

            return true;
        }


        private User GetUserDomainById(int id)
        {
            var user = _userRepository.Get(id);
            if (user == null)
            {
                throw new CustomException($"No user found with id: {id}");
            }

            return user;
        }
    }
}
