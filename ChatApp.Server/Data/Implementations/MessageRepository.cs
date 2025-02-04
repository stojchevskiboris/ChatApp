using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Implementations
{
    public class MessageRepository : Repository<Message>, IMessageRepository
    {
        private readonly ChatAppDbContext _context;

        public MessageRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public List<Message> GetMessagesSentOrRecievedByUser(int userId)
        {
            var pendingRequests = _context.Messages
                .Where(x => x.Recipient != null && x.Recipient.RecipientUser != null &&
                            x.Sender != null &&
                            (x.Recipient.RecipientUser.Id == userId) ||
                            (x.Sender.Id == userId))
                .OrderByDescending(x => x.CreatedAt)
                .ToList();

            return pendingRequests;
        }
    }
}