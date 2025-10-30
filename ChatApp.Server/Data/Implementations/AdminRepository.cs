using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Messages;
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

        #region Users
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

            // Sanitize/whitelist the column name to prevent SQL injection
            if (!string.IsNullOrWhiteSpace(model.SortColumn))
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

            if (!string.IsNullOrWhiteSpace(model.FirstName))
            {
                sql.AppendLine("AND FirstName LIKE @FirstName");
                parameters.Add(new SqlParameter("@FirstName", $"%{model.FirstName}%"));
            }

            if (!string.IsNullOrWhiteSpace(model.LastName))
            {
                sql.AppendLine("AND LastName LIKE @LastName");
                parameters.Add(new SqlParameter("@LastName", $"%{model.LastName}%"));
            }

            if (!string.IsNullOrWhiteSpace(model.Username))
            {
                sql.AppendLine("AND Username LIKE @Username");
                parameters.Add(new SqlParameter("@Username", $"%{model.Username}%"));
            }

            if (!string.IsNullOrWhiteSpace(model.Phone))
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
            //sql.AppendLine("ORDER BY RowNum");

            // Now execute and return result
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
        #endregion

        #region Messages
        public Message GetMessageById(int messageId)
        {
            return _context.Messages.FirstOrDefault(x => x.Id == messageId);
        }

        public List<Message> SearchMessages(MessageAdminSearchModel searchModel)
        {
            throw new NotImplementedException();
        }

        public IQueryable<Message> MessagesQueryable()
        {
            return _context.Messages.AsQueryable();
        }

        public byte[] ExportMessages(MessageAdminSearchModel model)
        {
            var orderByColumn = "m.Id";
            var direction = model.SortDirection?.ToUpper() == "DESC" ? "DESC" : "ASC";

            // switch case to prevent SQL injection
            if (!string.IsNullOrWhiteSpace(model.SortColumn))
            {
                switch (model.SortColumn.ToLower())
                {
                    case "senderid": orderByColumn = "s.SenderId"; break;
                    case "senderusername": orderByColumn = "s.Username"; break;
                    case "recipientid": orderByColumn = "RecipientId"; break;
                    case "recipientusername": orderByColumn = "r.Username"; break;
                    case "hasmedia": orderByColumn = "m.HasMedia"; break;
                    case "isseen": orderByColumn = "m.IsSeen"; break;
                    case "isdeleted": orderByColumn = "m.IsDeleted"; break;
                }
            }
            var sql = new StringBuilder();
            var parameters = new List<SqlParameter>();

            sql.AppendLine(@"
                SELECT * FROM (
                    SELECT 
                        m.Id,
                        m.SenderId,
                        s.Username AS SenderUsername,
                        m.RecipientId,
                        r.Username AS RecipientUsername,
                        m.Content,
                        m.HasMedia,
		                md.Url AS MediaUrl,
                        m.IsSeen,
                        m.IsDeleted,
                        m.ParentMessageId,
                        m.CreatedAt,
                        m.ModifiedAt,
                        ROW_NUMBER() OVER (ORDER BY " + orderByColumn + " " + direction + @") AS RowNum
                    FROM Messages m
                    LEFT JOIN Users s ON s.Id = m.SenderId
                    LEFT JOIN Users r ON r.Id = m.RecipientId
                    LEFT JOIN Media md ON md.MessageId = m.Id
                    WHERE 1=1
            ");

            if (!string.IsNullOrWhiteSpace(model.SenderUsername))
            {
                sql.AppendLine("AND s.Username LIKE @SenderUsername");
                parameters.Add(new SqlParameter("@SenderUsername", $"%{model.SenderUsername}%"));
            }

            if (model.SenderId.HasValue && model.SenderId.Value != 0)
            {
                sql.AppendLine("AND m.SenderId = @SenderId");
                parameters.Add(new SqlParameter("@SenderId", $"%{model.SenderId}%"));
            }

            if (!string.IsNullOrWhiteSpace(model.RecipientUsername))
            {
                sql.AppendLine("AND r.Username LIKE @RecipientUsername");
                parameters.Add(new SqlParameter("@RecipientUsername", $"%{model.RecipientUsername}%"));
            }

            if (model.RecipientId.HasValue && model.RecipientId.Value != 0)
            {
                sql.AppendLine("AND m.RecipientId = @RecipientId");
                parameters.Add(new SqlParameter("@RecipientId", $"%{model.RecipientId}%"));
            }

            if (string.IsNullOrWhiteSpace(model.Content) && model.HasMediaStatus.HasValue && model.HasMediaStatus.Value != 0)
            {
                sql.AppendLine("AND m.HasMedia = @HasMediaStatus");
                parameters.Add(new SqlParameter("@HasMediaStatus", model.HasMediaStatus.Value == 1 ? 1 : 0));
            }

            if (model.SeenStatus.HasValue && model.SeenStatus.Value != 0)
            {
                sql.AppendLine("AND m.IsSeen = @SeenStatus");
                parameters.Add(new SqlParameter("@SeenStatus", model.SeenStatus.Value == 1 ? 1 : 0));
            }

            if (model.DeletedStatus.HasValue && model.DeletedStatus.Value != 0)
            {
                sql.AppendLine("AND m.IsDeleted = @DeletedStatus");
                parameters.Add(new SqlParameter("@DeletedStatus", model.DeletedStatus.Value == 1 ? 1 : 0));
            }

            if (!string.IsNullOrWhiteSpace(model.Content))
            {
                sql.AppendLine("AND m.HasMedia = 0");
                sql.AppendLine("AND LOWER(m.Content) = @Content");
                parameters.Add(new SqlParameter("@Content", model.Content.ToLower()));
            }

            sql.AppendLine(@") AS UsersWithRowNum");
            //sql.AppendLine("ORDER BY RowNum");

            // Now execute and return result
            var messages = _context.Messages
                .FromSqlRaw(sql.ToString(), parameters.ToArray())
                .AsNoTracking()
                .ToList();

            var csv = new StringBuilder();
            csv.AppendLine("Id,SenderId,SenderUsername,RecipientId,RecipientUsername,Content,HasMedia,MediaUrl,IsSeen,IsDeleted,CreatedAt,ModifiedAt");

            foreach (var m in messages)
            {
                string content = m.Content?.Replace("\"", "\"\""); // double quotes inside content
                string mediaUrl = m.MediaContent?.Url?.Replace("\"", "\"\"");

                csv.AppendLine(
                    $"{m.Id}," +
                    $"{m.Sender.Id}," +
                    $"\"{m.Sender.Username}\"," +
                    $"{m.Recipient.RecipientUser.Id}," +
                    $"\"{m.Recipient.RecipientUser.Username}\"," +
                    $"\"{content}\"," +
                    $"{m.HasMedia}," +
                    $"\"{mediaUrl}\"," +
                    $"{m.IsSeen}," +
                    $"{m.IsDeleted}," +
                    $"{m.CreatedAt:dd.MM.yyyy HH:mm:ss}," +
                    $"{m.ModifiedAt:dd.MM.yyyy HH:mm:ss}"
                );
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }
        #endregion
    }
}
