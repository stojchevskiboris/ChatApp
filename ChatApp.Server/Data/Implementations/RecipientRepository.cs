using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Implementations
{
    public class RecipientRepository : Repository<Recipient>, IRecipientRepository
    {
        private readonly ChatAppDbContext _context;

        public RecipientRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }

        public Recipient? GetByUserId(int recipientUserId)
        {
            return _context.Recipients
                .Where(x => x.RecipientUser != null &&
                x.RecipientUser.Id == recipientUserId).FirstOrDefault();
        }
    }
}