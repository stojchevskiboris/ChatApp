using ChatApp.Server.Common.Constants;
using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Data.SqlClient;


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
            var currentUserId = Context.GetCurrentUserId();
            var user = _userRepository.Get(currentUserId);

            if (user == null)
            {
                throw new CustomException("User not found");
            }
            return user.MapToUserRoleViewModel();
        }

        #region Users
        public PagedResult<UserViewModel> SearchUsers(UserSearchModel model)
        {
            AuthorizeModeratorOrAdmin();

            var query = _adminRepository.UsersQueryable();
            if (!string.IsNullOrWhiteSpace(model.FirstName))
                query = query.Where(u => u.FirstName.Contains(model.FirstName));

            if (!string.IsNullOrWhiteSpace(model.LastName))
                query = query.Where(u => u.LastName.Contains(model.LastName));

            if (!string.IsNullOrWhiteSpace(model.Username))
                query = query.Where(u => u.Username.Contains(model.Username));

            if (!string.IsNullOrWhiteSpace(model.Phone))
                query = query.Where(u => u.Phone.Contains(model.Phone));

            if (model.Gender.HasValue && model.Gender.Value != 0)
                switch (model.Gender.Value)
                {
                    case 1:
                        query = query.Where(u => u.Gender == 1);
                        break;
                    case 2:
                        query = query.Where(u => u.Gender == 0);
                        break;
                    default:
                        break;
                }

            if (model.LastActive.HasValue && model.LastActive.Value != default)
                query = query.Where(u => u.LastActive.Date == model.LastActive.Value.Date);

            // Sorting
            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "firstname":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.FirstName)
                            : query.OrderBy(e => e.FirstName);
                        break;
                    case "lastname":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.LastName)
                            : query.OrderBy(e => e.LastName);
                        break;
                    case "username":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Username)
                            : query.OrderBy(e => e.Username);
                        break;
                    case "phone":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Phone)
                            : query.OrderBy(e => e.Phone);
                        break;
                    default:
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Id)
                            : query.OrderBy(e => e.Id);
                        break;
                }
            }

            var total = query.Count();

            var users = query
                .Skip(model.Page * model.Size)
                .Take(model.Size)
                .ToList();

            return new PagedResult<UserViewModel>
            {
                TotalCount = total,
                Items = users.MapToViewModelList(),
            };
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

        public UserViewModel SaveOrUpdateUser(UserRegisterModel userModel)
        {
            if (userModel == null)
            {
                throw new CustomException("User model cannot be null");
            }
            User user = null;

            if (userModel.Id.HasValue && userModel.Id.Value > 0)
            {
                user = _adminRepository.GetUserById(userModel.Id.Value);
            }

            if (user == null)
            {
                var newUser = new User()
                {
                    FirstName = userModel.FirstName,
                    LastName = userModel.LastName,
                    Username = userModel.Username,
                    Phone = userModel.Phone,
                    Gender = userModel.Gender,
                    DateOfBirth = DateTime.Parse(userModel.DateOfBirth),
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
                user.DateOfBirth = DateTime.Parse(userModel.DateOfBirth);
                user.ModifiedAt = DateTime.UtcNow;
                user.Password = PasswordHelper.HashPassword(PasswordHelper.DecryptString(userModel.Password));
                _userRepository.Update(user);
                return user.MapToAdminModel();
            }
        }

        public bool DeleteUser(int userId)
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

            return _userRepository.Delete(userId);
        }

        public byte[] ExportUsers(UserSearchModel model)
        {
            AuthorizeAdmin();
            return _adminRepository.ExportUsers(model);
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
        public SqlQueryResult ExecuteQuery(string sql)
        {
            AuthorizeAdmin();
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
        #endregion


        #region Private Methods
        private void AuthorizeModeratorOrAdmin()
        {
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole.Role != (int)UserRoleEnum.Moderator && currentUserRole.Role != (int)UserRoleEnum.Admin)
            {
                throw new CustomException("Unauthorized access");
            }
        }

        private void AuthorizeAdmin()
        {
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole.Role != (int)UserRoleEnum.Admin)
            {
                throw new CustomException("Unauthorized access");
            }
        }
        #endregion
    }
}
