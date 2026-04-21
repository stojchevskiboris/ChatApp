using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace ChatApp.Server.Data.Implementations
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ChatAppDbContext _context;

        public AdminRepository(ChatAppDbContext context)
        {
            _context = context;
        }

        public User GetUserById(int userId)
        {
            return _context.Users.FirstOrDefault(x => x.Id == userId);
        }

        public List<User> SearchUsers(UserSearchModel searchModel)
        {
            throw new NotImplementedException();
        }

        public IQueryable<User> UsersQueryable()
        {
            return _context.Users.AsQueryable();
        }

        public byte[] ExportUsers(UserSearchModel model)
        {
            var orderByColumn = "Id";
            var direction = model.SortDirection?.ToUpper() == "DESC" ? "DESC" : "ASC";

            {
                switch (model.SortColumn.ToLower())
                {
                    case "firstname": orderByColumn = "FirstName"; break;
                    case "lastname": orderByColumn = "LastName"; break;
                    case "username": orderByColumn = "Username"; break;
                    case "phone": orderByColumn = "Phone"; break;
                }
            }
            var sql = new StringBuilder();
            var parameters = new List<SqlParameter>();

            sql.AppendLine(@"
                SELECT * FROM (
                    SELECT 
                        Id,
                        FirstName,
                        LastName,
                        Username,
                        Password,
                        DateOfBirth,
                        Phone,
                        ProfilePictureId,
                        CreatedAt,
                        ModifiedAt,
                        Gender,
                        LastActive,
                        Role,
                        ROW_NUMBER() OVER (ORDER BY " + orderByColumn + " " + direction + @") AS RowNum
                    FROM Users
                    WHERE 1=1
            ");

            {
                sql.AppendLine("AND FirstName LIKE @FirstName");
                parameters.Add(new SqlParameter("@FirstName", $"%{model.FirstName}%"));
            }

            {
                sql.AppendLine("AND LastName LIKE @LastName");
                parameters.Add(new SqlParameter("@LastName", $"%{model.LastName}%"));
            }

            {
                sql.AppendLine("AND Username LIKE @Username");
                parameters.Add(new SqlParameter("@Username", $"%{model.Username}%"));
            }

            {
                sql.AppendLine("AND Phone LIKE @Phone");
                parameters.Add(new SqlParameter("@Phone", $"%{model.Phone}%"));
            }

            if (model.Gender.HasValue && model.Gender.Value != 0)
            {
                sql.AppendLine("AND Gender = @Gender");
                parameters.Add(new SqlParameter("@Gender", model.Gender.Value == 1 ? 1 : 0));
            }

            if (model.LastActive.HasValue && model.LastActive.Value != default)
            {
                sql.AppendLine("AND CAST(LastActive AS DATE) = @LastActive");
                parameters.Add(new SqlParameter("@LastActive", model.LastActive.Value.Date));
            }

            sql.AppendLine(@") AS UsersWithRowNum");

            var users = _context.Users
                .FromSqlRaw(sql.ToString(), parameters.ToArray())
                .AsNoTracking()
                .ToList();

            var csv = new StringBuilder();
            csv.AppendLine("Id,FirstName,LastName,Username,DateOfBirth,Phone,Gender,ProfilePicture,Contacts,LastActive");

            foreach (var u in users)
            {
                csv.AppendLine($"{u.Id},{u.FirstName},{u.LastName},{u.Username},{u.DateOfBirth.ToString("dd.MM.yyyy")},{u.Phone},{EnumHelper.GetEnumDescription((GenderEnum)u.Gender)},{u.ProfilePicture?.Url},{u.Contacts?.Count()},{u.LastActive.ToString("dd.MM.yyyy HH:mm:ss")}");
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }

        #region Groups
        public IQueryable<Group> GroupsQueryable() => _context.Groups.AsQueryable();
        public Group GetGroupById(int id) => _context.Groups.FirstOrDefault(x => x.Id == id);
        public bool DeleteGroup(int id)
        {
            var group = _context.Groups.FirstOrDefault(x => x.Id == id);
            if (group == null) return false;
            _context.Groups.Remove(group);
            _context.SaveChanges();
            return true;
        }
        #endregion

        #region GroupUsers
        public IQueryable<GroupUser> GroupUsersQueryable() => _context.GroupUsers.AsQueryable();
        public GroupUser GetGroupUserById(int id) => _context.GroupUsers.FirstOrDefault(x => x.Id == id);
        public bool DeleteGroupUser(int id)
        {
            var groupUser = _context.GroupUsers.FirstOrDefault(x => x.Id == id);
            if (groupUser == null) return false;
            _context.GroupUsers.Remove(groupUser);
            _context.SaveChanges();
            return true;
        }
        #endregion

        #region Messages
        public IQueryable<Message> MessagesQueryable() => _context.Messages.AsQueryable();
        public Message GetMessageById(int id) => _context.Messages.FirstOrDefault(x => x.Id == id);
        public bool DeleteMessage(int id)
        {
            var message = _context.Messages.FirstOrDefault(x => x.Id == id);
            if (message == null) return false;
            message.IsDeleted = true;
            message.ModifiedAt = DateTime.UtcNow;
            _context.SaveChanges();
            return true;
        }
        #endregion

        #region Media
        public IQueryable<Media> MediaQueryable() => _context.Media.AsQueryable();
        public Media GetMediaById(int id) => _context.Media.FirstOrDefault(x => x.Id == id);
        public bool DeleteMedia(int id)
        {
            var media = _context.Media.FirstOrDefault(x => x.Id == id);
            if (media == null) return false;
            _context.Media.Remove(media);
            _context.SaveChanges();
            return true;
        }
        #endregion

        #region Recipients
        public IQueryable<Recipient> RecipientsQueryable() => _context.Recipients.AsQueryable();
        public Recipient GetRecipientById(int id) => _context.Recipients.FirstOrDefault(x => x.Id == id);
        public bool DeleteRecipient(int id)
        {
            var recipient = _context.Recipients.FirstOrDefault(x => x.Id == id);
            if (recipient == null) return false;
            _context.Recipients.Remove(recipient);
            _context.SaveChanges();
            return true;
        }
        #endregion

        #region Requests
        public IQueryable<Request> RequestsQueryable() => _context.Requests.AsQueryable();
        public Request GetRequestById(int id) => _context.Requests.FirstOrDefault(x => x.Id == id);
        public bool DeleteRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(x => x.Id == id);
            if (request == null) return false;
            request.IsDeleted = true;
            request.ModifiedAt = DateTime.UtcNow;
            _context.SaveChanges();
            return true;
        }
        #endregion
    }
}
