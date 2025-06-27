using ChatApp.Server.Common.Constants;
using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Configs.Authentication.Models;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Data.SqlClient;
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

        public SqlQueryResult ExecuteQuery(string sql)
        {
            using var connection = new SqlConnection(AppParameters.ConnectionString);
            connection.Open();

            using var command = new SqlCommand(sql, connection);
            using var reader = command.ExecuteReader();

            var result = new SqlQueryResult();
            var schema = reader.GetColumnSchema();
            result.Columns = schema.Select(c => c.ColumnName).ToList();

            var rows = new List<List<object>>();
            while (reader.Read())
            {
                var row = new List<object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row.Add(reader[i]);
                }
                rows.Add(row);
            }

            result.Rows = rows;
            result.Message = $"{rows.Count} row(s) returned";
            return result;
        }

        public UserRoleViewModel GetCurrentUserRole()
        {
            var currentUserId = Context.GetCurrentUserId();
            var user = _userRepository.Get(currentUserId);

            if (user == null)
            {
                throw new CustomException("User not found");
            }
            return user.MapToUserRoleViewModel();
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

        public UserAdminModel CreateOrUpdateUser(UserAdminModel userModel)
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
                    Phone = userModel.Phone,
                    Gender = userModel.Gender,
                    DateOfBirth = userModel.DateOfBirth,
                    Role = userModel.Role,
                    CreatedAt = DateTime.UtcNow,
                    ModifiedAt = DateTime.UtcNow,
                    Password = PasswordHelper.HashPassword(PasswordHelper.DecryptString(userModel.Password)),
                };

                _userRepository.Create(newUser);
                return newUser.MapToAdminModel();
            }
            else
            {
                user.FirstName = userModel.FirstName;
                user.LastName = userModel.LastName;
                user.Username = userModel.Username;
                user.Phone = userModel.Phone;
                user.Gender = userModel.Gender;
                user.DateOfBirth = userModel.DateOfBirth;
                user.Role = userModel.Role;
                user.ModifiedAt = DateTime.UtcNow;
                user.Password = PasswordHelper.HashPassword(PasswordHelper.DecryptString(userModel.Password));
                _userRepository.Update(user);
                return user.MapToAdminModel();
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
