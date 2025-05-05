using ChatApp.Server.Common.Constants;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ChatApp.Server.Data.Implementations
{
    public class RequestRepository : Repository<Request>, IRequestRepository
    {
        private readonly ChatAppDbContext _context;

        public RequestRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public bool HasExistingActiveRequest(int userFromId, int userToId)
        {
            var existingRequest = _context.Requests
                .Where(x => x.UserFrom.Id == userFromId
                         && x.UserTo.Id == userToId
                         && x.RequestStatus == (int)RequestStatusEnum.Pending)
                .Any();

            return existingRequest;
        }

        public List<Request> GetPendingRequestsSentFromCurrentUser(int currentUserId)
        {
            // Execute the stored procedure and map results
            var result = _context.Requests
                .Where(x => x.UserFrom.Id == currentUserId
                         && x.RequestStatus == (int)RequestStatusEnum.Pending);

            //using (var connection = _context.Database.GetDbConnection())
            //{
            //    connection.ConnectionString = AppParameters.ConnectionString;
            //    connection.Open();

            //    result = connection.Query<Request>(
            //        "EXEC dbo.GetPendingRequestsSentFromCurrentUser @CurrentUserId",
            //        new
            //        {
            //            currentUserId
            //        }).ToList();

            //    connection.Close();
            //}

            return result.ToList();
        }

        public List<Request> GetPendingRequests(int currentUserId)
        {
            var pendingRequests = _context.Requests
                .Where(x => x.UserFrom.Id != currentUserId
                         && x.UserTo.Id == currentUserId
                         && x.RequestStatus == (int)RequestStatusEnum.Pending)
                .ToList();

            return pendingRequests;
        }

        public List<Request> GetArchivedRequests(int currentUserId)
        {
            var archivedRequests = _context.Requests
                .Where(x => 
                         (x.UserFrom.Id == currentUserId || x.UserTo.Id == currentUserId)
                         && x.IsDeleted == false)
                .ToList();

            return archivedRequests;
        }

        public List<Request> GetByUserIds(int userFromId, int userToId)
        {
            var pendingRequests = _context.Requests
                .Where(x => x.UserFrom.Id == userFromId
                    && x.UserTo.Id == userToId
                    && x.RequestStatus == (int)RequestStatusEnum.Pending)
                .ToList();

            return pendingRequests;
        }

    }
}