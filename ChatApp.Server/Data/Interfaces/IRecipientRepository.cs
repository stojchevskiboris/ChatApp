using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IRecipientRepository : IRepository<Recipient>
    {
        public Recipient? GetByUserId(int recipientUserId);

    }
}
