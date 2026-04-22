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
using ChatApp.Server.Services.ViewModels.Groups;
using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Recipients;
using ChatApp.Server.Services.ViewModels.Requests;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Data.SqlClient;

namespace ChatApp.Server.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupUserRepository _groupUserRepository;
        private readonly IRequestRepository _requestRepository;

        public AdminService(
            IUserRepository userRepository,
            IAdminRepository adminRepository,
            IGroupRepository groupRepository,
            IGroupUserRepository groupUserRepository,
            IRequestRepository requestRepository)
        {
            _userRepository = userRepository;
            _adminRepository = adminRepository;
            _groupRepository = groupRepository;
            _groupUserRepository = groupUserRepository;
            _requestRepository = requestRepository;
        }

        public UserRoleViewModel GetCurrentUserRole()
        {
            var currentUserId = Context.GetCurrentUserId();
            var user = _userRepository.Get(currentUserId);
            if (user == null)
                throw new CustomException("User not found");
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
                    case 1: query = query.Where(u => u.Gender == 1); break;
                    case 2: query = query.Where(u => u.Gender == 0); break;
                }
            if (model.LastActive.HasValue && model.LastActive.Value != default)
                query = query.Where(u => u.LastActive.Date == model.LastActive.Value.Date);

            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "firstname": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName); break;
                    case "lastname": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName); break;
                    case "username": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Username) : query.OrderBy(e => e.Username); break;
                    case "phone": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Phone) : query.OrderBy(e => e.Phone); break;
                    default: query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id); break;
                }
            }
            var total = query.Count();
            var users = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<UserViewModel> { TotalCount = total, Items = users.MapToViewModelList() };
        }

        public UserViewModel GetUserById(int userId)
        {
            if (userId <= 0) throw new CustomException("Invalid user ID");
            var user = _adminRepository.GetUserById(userId);
            if (user == null) throw new CustomException("User not found");
            return user.MapToViewModel();
        }

        public UserViewModel SaveOrUpdateUser(UserRegisterModel userModel)
        {
            if (userModel == null) throw new CustomException("User model cannot be null");
            User user = null;
            if (userModel.Id.HasValue && userModel.Id.Value > 0)
                user = _adminRepository.GetUserById(userModel.Id.Value);

            if (user == null)
            {
                var newUser = new User
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
            if (userId <= 0) throw new CustomException("Invalid user ID");
            var user = _adminRepository.GetUserById(userId);
            if (user == null) throw new CustomException("User not found");
            return _userRepository.Delete(userId);
        }

        public byte[] ExportUsers(UserSearchModel model)
        {
            AuthorizeAdmin();
            return _adminRepository.ExportUsers(model);
        }
        #endregion

        #region Groups
        public PagedResult<GroupViewModel> SearchGroups(GroupSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.GroupsQueryable();
            if (!string.IsNullOrWhiteSpace(model.Name))
                query = query.Where(g => g.Name.Contains(model.Name));
            if (model.CreatedByUserId.HasValue && model.CreatedByUserId.Value > 0)
                query = query.Where(g => g.CreatedByUserId == model.CreatedByUserId.Value);

            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "name": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Name) : query.OrderBy(e => e.Name); break;
                    case "createdat": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt); break;
                    default: query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id); break;
                }
            }
            else
            {
                query = query.OrderBy(e => e.Id);
            }
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<GroupViewModel> { TotalCount = total, Items = items.MapToViewModelList() };
        }

        public GroupViewModel GetGroupById(int id)
        {
            var group = _adminRepository.GetGroupById(id);
            if (group == null) throw new CustomException("Group not found");
            return group.MapToViewModel();
        }

        public GroupViewModel SaveOrUpdateGroup(SaveGroupModel model)
        {
            if (model == null) throw new CustomException("Invalid model");
            if (model.Id.HasValue && model.Id.Value > 0)
            {
                var existing = _adminRepository.GetGroupById(model.Id.Value);
                if (existing == null) throw new CustomException("Group not found");
                existing.Name = model.Name;
                existing.ModifiedAt = DateTime.UtcNow;
                _groupRepository.Update(existing);
                return existing.MapToViewModel();
            }
            else
            {
                var currentUserId = Context.GetCurrentUserId();
                var group = new Group
                {
                    Name = model.Name,
                    CreatedByUserId = currentUserId,
                    CreatedAt = DateTime.UtcNow,
                    ModifiedAt = DateTime.UtcNow
                };
                _groupRepository.Create(group);
                return group.MapToViewModel();
            }
        }

        public bool DeleteGroup(int id)
        {
            var group = _adminRepository.GetGroupById(id);
            if (group == null) throw new CustomException("Group not found");
            return _adminRepository.DeleteGroup(id);
        }
        #endregion

        #region GroupUsers
        public PagedResult<GroupUserViewModel> SearchGroupUsers(GroupUserSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.GroupUsersQueryable();
            if (model.GroupId.HasValue && model.GroupId.Value > 0)
                query = query.Where(gu => gu.GroupId == model.GroupId.Value);
            if (model.UserId.HasValue && model.UserId.Value > 0)
                query = query.Where(gu => gu.UserId == model.UserId.Value);
            query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id);
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<GroupUserViewModel> { TotalCount = total, Items = items.MapToViewModelList() };
        }

        public GroupUserViewModel GetGroupUserById(int id)
        {
            var gu = _adminRepository.GetGroupUserById(id);
            if (gu == null) throw new CustomException("GroupUser not found");
            return gu.MapToViewModel();
        }

        public GroupUserViewModel SaveGroupUser(SaveGroupUserModel model)
        {
            if (model == null) throw new CustomException("Invalid model");

            var group = _adminRepository.GetGroupById(model.GroupId);
            if (group == null) throw new CustomException("Group not found");

            var groupUser = new GroupUser
            {
                GroupId = model.GroupId,
                UserId = model.UserId,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow
            };
            _groupUserRepository.Create(groupUser);
            return _adminRepository.GetGroupUserById(groupUser.Id).MapToViewModel();
        }

        public bool DeleteGroupUser(int id)
        {
            var gu = _adminRepository.GetGroupUserById(id);
            if (gu == null) throw new CustomException("GroupUser not found");
            return _adminRepository.DeleteGroupUser(id);
        }
        #endregion

        #region Messages
        public PagedResult<AdminMessageViewModel> SearchMessages(AdminMessageSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.MessagesQueryable();
            if (model.SenderId.HasValue && model.SenderId.Value > 0)
                query = query.Where(m => m.Sender.Id == model.SenderId.Value);
            if (!string.IsNullOrWhiteSpace(model.Content))
                query = query.Where(m => m.Content != null && m.Content.Contains(model.Content));
            if (model.IsSeen.HasValue)
                query = query.Where(m => m.IsSeen == model.IsSeen.Value);
            if (model.IsDeleted.HasValue)
                query = query.Where(m => m.IsDeleted == model.IsDeleted.Value);

            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "createdat": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt); break;
                    default: query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id); break;
                }
            }
            else
            {
                query = query.OrderBy(e => e.Id);
            }
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<AdminMessageViewModel> { TotalCount = total, Items = items.Select(m => MapMessageToAdminViewModel(m)).ToList() };
        }

        private AdminMessageViewModel MapMessageToAdminViewModel(Message m)
        {
            return new AdminMessageViewModel
            {
                Id = m.Id,
                SenderId = m.Sender?.Id ?? 0,
                SenderUsername = m.Sender?.Username ?? "",
                RecipientId = m.Recipient?.Id ?? 0,
                Content = m.Content ?? "",
                HasMedia = m.HasMedia,
                IsSeen = m.IsSeen,
                IsDeleted = m.IsDeleted,
                ParentMessageId = m.ParentMessage?.Id,
                CreatedAt = m.CreatedAt,
                ModifiedAt = m.ModifiedAt
            };
        }

        public AdminMessageViewModel GetMessageById(int id)
        {
            var m = _adminRepository.GetMessageById(id);
            if (m == null) throw new CustomException("Message not found");
            return MapMessageToAdminViewModel(m);
        }

        public bool DeleteMessage(int id)
        {
            var m = _adminRepository.GetMessageById(id);
            if (m == null) throw new CustomException("Message not found");
            return _adminRepository.DeleteMessage(id);
        }
        #endregion

        #region Media
        public PagedResult<MediaViewModel> SearchMedia(MediaSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.MediaQueryable();
            if (model.MessageId.HasValue && model.MessageId.Value > 0)
                query = query.Where(m => m.MessageId == model.MessageId.Value);
            if (!string.IsNullOrWhiteSpace(model.FileType))
                query = query.Where(m => m.FileType.Contains(model.FileType));

            if (!string.IsNullOrEmpty(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "filetype": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.FileType) : query.OrderBy(e => e.FileType); break;
                    case "filesize": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.FileSize) : query.OrderBy(e => e.FileSize); break;
                    case "createdat": query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt); break;
                    default: query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id); break;
                }
            }
            else
            {
                query = query.OrderBy(e => e.Id);
            }
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<MediaViewModel> { TotalCount = total, Items = items.MapToViewModelList() };
        }

        public MediaViewModel GetMediaById(int id)
        {
            var media = _adminRepository.GetMediaById(id);
            if (media == null) throw new CustomException("Media not found");
            return media.MapToViewModel();
        }

        public bool DeleteMedia(int id)
        {
            var media = _adminRepository.GetMediaById(id);
            if (media == null) throw new CustomException("Media not found");
            return _adminRepository.DeleteMedia(id);
        }
        #endregion

        #region Recipients
        public PagedResult<RecipientViewModel> SearchRecipients(RecipientSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.RecipientsQueryable();
            if (model.RecipientTypeId.HasValue && model.RecipientTypeId.Value > 0)
                query = query.Where(r => r.RecipientTypeId == model.RecipientTypeId.Value);
            query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id);
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<RecipientViewModel> { TotalCount = total, Items = items.Select(r => MapRecipientToViewModel(r)).ToList() };
        }

        private RecipientViewModel MapRecipientToViewModel(Recipient r)
        {
            return new RecipientViewModel
            {
                Id = r.Id,
                RecipientTypeId = r.RecipientTypeId,
                RecipientUserId = r.RecipientUser?.Id,
                RecipientUsername = r.RecipientUser?.Username,
                RecipientGroupId = r.RecipientGroup?.Id,
                RecipientGroupName = r.RecipientGroup?.Name,
                CreatedAt = r.CreatedAt,
                ModifiedAt = r.ModifiedAt
            };
        }

        public RecipientViewModel GetRecipientById(int id)
        {
            var r = _adminRepository.GetRecipientById(id);
            if (r == null) throw new CustomException("Recipient not found");
            return MapRecipientToViewModel(r);
        }

        public bool DeleteRecipient(int id)
        {
            var r = _adminRepository.GetRecipientById(id);
            if (r == null) throw new CustomException("Recipient not found");
            return _adminRepository.DeleteRecipient(id);
        }
        #endregion

        #region Requests
        public PagedResult<RequestViewModel> SearchRequests(RequestSearchModel model)
        {
            AuthorizeModeratorOrAdmin();
            var query = _adminRepository.RequestsQueryable();
            if (model.UserFromId.HasValue && model.UserFromId.Value > 0)
                query = query.Where(r => r.UserFromId == model.UserFromId.Value);
            if (model.UserToId.HasValue && model.UserToId.Value > 0)
                query = query.Where(r => r.UserToId == model.UserToId.Value);
            if (model.RequestStatus.HasValue && model.RequestStatus.Value > 0)
                query = query.Where(r => r.RequestStatus == model.RequestStatus.Value);
            if (model.IsDeleted.HasValue)
                query = query.Where(r => r.IsDeleted == model.IsDeleted.Value);
            query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id);
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<RequestViewModel> { TotalCount = total, Items = items.Select(r => MapRequestToViewModel(r)).ToList() };
        }

        private RequestViewModel MapRequestToViewModel(Request r)
        {
            return new RequestViewModel
            {
                Id = r.Id,
                UserFromId = r.UserFromId,
                UserToId = r.UserToId,
                RequestStatus = r.RequestStatus,
                IsDeleted = r.IsDeleted,
                CreatedAt = r.CreatedAt,
                ModifiedAt = r.ModifiedAt
            };
        }

        public RequestViewModel GetRequestById(int id)
        {
            var r = _adminRepository.GetRequestById(id);
            if (r == null) throw new CustomException("Request not found");
            return MapRequestToViewModel(r);
        }

        public RequestViewModel UpdateRequest(UpdateRequestModel model)
        {
            var r = _adminRepository.GetRequestById(model.Id);
            if (r == null) throw new CustomException("Request not found");
            r.RequestStatus = model.RequestStatus;
            r.ModifiedAt = DateTime.UtcNow;
            _requestRepository.Update(r);
            return GetRequestById(model.Id);
        }

        public bool DeleteRequest(int id)
        {
            var r = _adminRepository.GetRequestById(id);
            if (r == null) throw new CustomException("Request not found");
            return _adminRepository.DeleteRequest(id);
        }
        #endregion

        #region Roles
        public PagedResult<UserAdminModel> SearchRoles(RoleSearchModel model)
        {
            AuthorizeAdmin();
            var query = _adminRepository.UsersQueryable();
            if (!string.IsNullOrWhiteSpace(model.Username))
                query = query.Where(u => u.Username.Contains(model.Username));
            if (!string.IsNullOrWhiteSpace(model.FirstName))
                query = query.Where(u => u.FirstName.Contains(model.FirstName));
            if (!string.IsNullOrWhiteSpace(model.LastName))
                query = query.Where(u => u.LastName.Contains(model.LastName));
            if (model.Role.HasValue)
                query = query.Where(u => u.Role == model.Role.Value);
            query = model.SortDirection.ToLower() == "desc" ? query.OrderByDescending(e => e.Id) : query.OrderBy(e => e.Id);
            var total = query.Count();
            var items = query.Skip(model.Page * model.Size).Take(model.Size).ToList();
            return new PagedResult<UserAdminModel> { TotalCount = total, Items = items.Select(u => u.MapToAdminModel()).ToList() };
        }

        public bool UpdateUserRole(RoleUpdateModel model)
        {
            var user = _adminRepository.GetUserById(model.UserId);
            if (user == null) throw new CustomException("User not found");
            user.Role = model.Role;
            user.ModifiedAt = DateTime.UtcNow;
            _userRepository.Update(user);
            return true;
        }
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
                    row.Add(reader[i]);
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
                throw new CustomException("Unauthorized access");
        }

        private void AuthorizeAdmin()
        {
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole.Role != (int)UserRoleEnum.Admin)
                throw new CustomException("Unauthorized access");
        }
        #endregion
    }
}
