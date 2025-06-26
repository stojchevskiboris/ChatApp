using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Configs.Authentication.Models;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApp.Server.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAdminRepository _adminRepository;

        public AdminService(
            IUserRepository userRepository,
            IAdminRepository adminRepository)
        {
            _userRepository = userRepository;
            _adminRepository = adminRepository;
        }

        public UserRoleViewModel GetCurrentUserRole()
        {
            throw new NotImplementedException();
        }

        #region Users
        public List<UserViewModel> SearchUsers(UserSearchModel searchModel)
        {
            var users = _adminRepository.SearchUsers(searchModel);
            return users.MapToViewModelList();
        }

        public UserViewModel GetUserById(int userId)
        {
            if (userId <= 0)
            {
                throw new CustomException("Invalid user ID");
            }

            var user = _adminRepository.GetUserById(userId);
            if (user == null)
            {
                throw new CustomException("User not found");
            }

            return user.MapToViewModel();
        }

        public UserViewModel CreateOrUpdateUser(UserAdminModel userModel)
        {
            if (userModel == null)
            {
                throw new CustomException("User model cannot be null");
            }

            var user = _adminRepository.GetUserById(userModel.Id);
            if (user == null)
            {
                var newUser = new User()
                {
                    FirstName = userModel.FirstName,
                    LastName = userModel.LastName,
                    Username = userModel.Username,
                    Password = PasswordHelper.HashPassword(PasswordHelper.DecryptString(userModel.Password)),


            };
            }
            else
            {
                user.FirstName = userModel.FirstName;
                user.LastName = userModel.LastName;
                user.Username = userModel.Username;
                user.DateOfBirth = userModel.DateOfBirth;
                user.Gender = userModel.Gender;
                user.Phone = userModel.Phone;

            }

        }
        #endregion


        #region Messages

        #endregion


        #region Groups

        #endregion


        #region GroupUsers

        #endregion


        #region Recipients

        #endregion


        #region UserContacts

        #endregion


        #region Requests

        #endregion


        #region Media

        #endregion


        #region QueryEditor
        // repository methods for the provided query string that will be executed against the database
        #endregion

    }
}
