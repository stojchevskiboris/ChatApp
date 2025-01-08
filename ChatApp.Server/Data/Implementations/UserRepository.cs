using ChatApp.Server.Common.Constants;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;
using Dapper;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ChatApp.Server.Data.Implementations
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ChatAppDbContext _context;

        public UserRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public User GetByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public List<int> GetContactsByUserId(int currentUserId)
        {
            var result = new List<int>();
            //result = _context.Database
            //    .SqlQuery<int>($"EXEC dbo.GetContactsByUserId {currentUserId}");

            var userContacts = _context.Users
                .Where(x => x.Id == currentUserId)
                .FirstOrDefault();

            if (userContacts != null && userContacts.Contacts.Any())
            {
                result = userContacts.Contacts.Select(x => x.ContactId).ToList();
            }

            return result.ToList();
        }


        public List<User> SearchUsersToAdd(int currentUserId, string query, List<int> contactIds)
        {
            var terms = query.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            // ToDo: fix search algorithm ("Testuser St" returns results without containing Testuser because of the St)
            return _context.Users.Where(
                u => u.Id != currentUserId &&
                !contactIds.Contains(u.Id) &&
                terms.Any(term =>
                    u.FirstName.ToLower().Contains(term) ||
                    u.LastName.ToLower().Contains(term)
                )
            ).ToList();

            //// Split the query into terms
            //var terms = query.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            //// Create DataTable for @terms
            //var termsTable = new DataTable();
            //termsTable.Columns.Add("Value", typeof(string));
            //foreach (var term in terms)
            //{
            //    termsTable.Rows.Add(term);
            //}

            //// Create DataTable for @contactIds
            //var contactIdsTable = new DataTable();
            //contactIdsTable.Columns.Add("Value", typeof(int));
            //foreach (var contactId in contactIds)
            //{
            //    contactIdsTable.Rows.Add(contactId);
            //}

            //// Execute the stored procedure and map results
            //var result = new List<User>();

            //using (var connection = _context.Database.GetDbConnection())
            //{
            //    connection.ConnectionString = AppParameters.ConnectionString;
            //    connection.Open();

            //    result = connection.Query<User>(
            //        "EXEC dbo.SearchUsersToAdd @currentUserId, @terms, @contactIds",
            //        new
            //        {
            //            currentUserId,
            //            terms = termsTable.AsTableValuedParameter("dbo.StringListType"),
            //            contactIds = contactIdsTable.AsTableValuedParameter("dbo.IntListType")
            //        }).ToList();

            //    connection.Close();
            //}

            //return result;
        }

        public bool HasInContacts(User user, int contactId)
        {
            if (user.Contacts.Any())
            {
                //return user.Contacts.Select(x => x.ContactId == contactId).Any();
                return user.Contacts.Any(x => x.ContactId == contactId);
            }
            return false;
        }
    }
}
