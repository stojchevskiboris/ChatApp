using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IMessageRepository : IRepository<Message>
    {
        public List<Message> GetMessagesSentOrRecievedByUser(int userId);

    }
}
