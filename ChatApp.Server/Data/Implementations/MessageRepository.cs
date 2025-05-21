using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Data.Implementations
{
    public class MessageRepository : Repository<Message>, IMessageRepository
    {
        private readonly ChatAppDbContext _context;

        public MessageRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public List<Message> GetMessagesSentOrReceivedByUser(int userId)
        {
            var messages = _context.Messages
                .Where(x => x.Recipient != null && x.Recipient.RecipientUser != null &&
                            x.Sender != null &&
                                ((x.Sender.Id == userId) ||
                                (x.Recipient.RecipientUser.Id == userId)) &&
                            x.IsDeleted == false)
                .OrderByDescending(x => x.CreatedAt)
                .ToList();

            return messages;
        }

        public List<Message> GetMessagesBySenderAndRecipient(int user1Id, int user2Id)
        {
            var messages = _context.Messages
                .Where(x => x.Recipient != null && x.Recipient.RecipientUser != null &&
                            x.Sender != null &&
                                ((x.Recipient.RecipientUser.Id == user1Id && x.Sender.Id == user2Id) ||
                                (x.Recipient.RecipientUser.Id == user2Id && x.Sender.Id == user1Id)) &&
                            x.IsDeleted == false)
                .OrderByDescending(x => x.CreatedAt)
                .ToList();

            return messages;
        }

        public void UpdateMessagesSeen(List<Message> messages, int seenByUserId)
        {
            if (messages == null || messages.Count == 0)
            {
                return;
            }

            _context.Messages
                .Where(m => messages.Select(x => x.Id)
                .Contains(m.Id) && m.Recipient.RecipientUser.Id == seenByUserId)
                .ExecuteUpdate(m => m.SetProperty(x => x.IsSeen, true));
        }
    }
}