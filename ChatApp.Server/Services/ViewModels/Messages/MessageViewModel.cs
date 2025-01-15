using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class MessageViewModel
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public string Content { get; set; }

        public bool HasMedia { get; set; }

        public bool IsSeen { get; set; }

        public int? ParentMessage { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
