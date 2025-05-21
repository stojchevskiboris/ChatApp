using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Data.Interfaces
{
    public interface IMessageRepository : IRepository<Message>
    {
        public List<Message> GetMessagesSentOrReceivedByUser(int userId);
        public List<Message> GetMessagesBySenderAndRecipient(int user1Id, int user2Id);
        public void UpdateMessagesSeen(List<Message> messages, int seenByUserId);
    }
}
