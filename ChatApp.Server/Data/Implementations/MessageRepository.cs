using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
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
    }
}