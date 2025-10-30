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
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Data.SqlClient;


namespace ChatApp.Server.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IMessageRepository _messageRepository;

        public AdminService(
            IUserRepository userRepository,
            IAdminRepository adminRepository,
            IMessageRepository messageRepository)
        {
            _userRepository = userRepository;
            _adminRepository = adminRepository;
            _messageRepository = messageRepository;
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
        public PagedResult<MessageAdminViewModel> SearchMessages(MessageAdminSearchModel model)
        {
            AuthorizeModeratorOrAdmin();

            var query = _adminRepository.MessagesQueryable();

            if (!string.IsNullOrWhiteSpace(model.SenderUsername))
            {
                query = query.Where(u => u.Sender != null && u.Sender.Username.ToLower().Contains(model.SenderUsername.ToLower()));
            }

            if (model.SenderId != null)
            {
                query = query.Where(u => u.Sender != null && u.Sender.Id != 0 && u.Sender.Id == model.SenderId.Value);
            }

            if (!string.IsNullOrWhiteSpace(model.RecipientUsername))
            {
                query = query.Where(u => u.Recipient != null && u.Recipient.RecipientUser != null && u.Recipient.RecipientUser.Username.ToLower().Contains(model.RecipientUsername.ToLower()));
            }

            if (model.RecipientId != null)
            {
                query = query.Where(u => u.Recipient != null && u.Recipient.RecipientUser != null && u.Recipient.RecipientUser.Id != 0 && u.Recipient.RecipientUser.Id == model.RecipientId.Value);
            }

            if (model.HasMediaStatus.HasValue && model.HasMediaStatus.Value != 0)
            {
                switch (model.HasMediaStatus.Value)
                {
                    case 1:
                        query = query.Where(u => u.HasMedia);
                        break;
                    case 2:
                        query = query.Where(u => !u.HasMedia);
                        break;
                    default:
                        break;
                }
            }

            if (model.SeenStatus.HasValue && model.SeenStatus.Value != 0)
            {
                switch (model.SeenStatus.Value)
                {
                    case 1:
                        query = query.Where(u => u.IsSeen);
                        break;
                    case 2:
                        query = query.Where(u => !u.IsSeen);
                        break;
                    default:
                        break;
                }
            }

            if (model.DeletedStatus.HasValue && model.DeletedStatus.Value != 0)
            {
                switch (model.DeletedStatus.Value)
                {
                    case 1:
                        query = query.Where(u => u.IsDeleted);
                        break;
                    case 2:
                        query = query.Where(u => !u.IsDeleted);
                        break;
                    default:
                        break;
                }
            }

            if (!string.IsNullOrWhiteSpace(model.Content))
            {
                query = query.Where(u => !u.HasMedia && u.Content.ToLower().Contains(model.Content.ToLower()));
            }

            // Sorting
            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "senderusername":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Sender.Username)
                            : query.OrderBy(e => e.Sender.Username);
                        break;
                    case "recipientusername":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Recipient != null && e.Recipient.RecipientUser != null
                                    ? e.Recipient.RecipientUser.Username : "")
                            : query.OrderBy(e => e.Recipient != null && e.Recipient.RecipientUser != null
                                    ? e.Recipient.RecipientUser.Username : "");
                        break;
                    case "senderid":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Sender.Id)
                            : query.OrderBy(e => e.Sender.Id);
                        break;
                    case "recipientid":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Recipient != null && e.Recipient.RecipientUser != null
                                    ? e.Recipient.RecipientUser.Id : 0)
                            : query.OrderBy(e => e.Recipient != null && e.Recipient.RecipientUser != null
                                    ? e.Recipient.RecipientUser.Id : 0);
                        break;
                    case "hasmedia":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.HasMedia)
                            : query.OrderBy(e => e.HasMedia);
                        break;
                    case "isseen":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.IsSeen)
                            : query.OrderBy(e => e.IsSeen);
                        break;
                    case "isdeleted":
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.IsDeleted)
                            : query.OrderBy(e => e.IsDeleted);
                        break;
                    default:
                        query = model.SortDirection.ToLower() == "desc"
                            ? query.OrderByDescending(e => e.Id)
                            : query.OrderBy(e => e.Id);
                        break;
                }
            }

            var total = query.Count();

            var messages = query
                .Skip(model.Page * model.Size)
                .Take(model.Size)
                .ToList();

            return new PagedResult<MessageAdminViewModel>
            {
                TotalCount = total,
                Items = messages.MapToAdminViewModelList(),
            };
        }

        public MessageAdminViewModel GetMessageById(int userId)
        {
            throw new NotImplementedException();
        }

        public MessageAdminViewModel SaveOrUpdateMessage(MessageViewModel model)
        {
            throw new NotImplementedException();
        }

        public bool DeleteMessage(int messageId)
        {
            throw new NotImplementedException();
        }

        public byte[] ExportMessages(MessageAdminSearchModel model)
        {
            AuthorizeAdmin();
            return _adminRepository.ExportMessages(model);
        }
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
