using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Server.Domain.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        //[ForeignKey("SenderId")]
        public User Sender { get; set; }

        //public int? SenderId { get; set; }

        [Required]
        //[ForeignKey("RecipientId")]
        public Recipient Recipient { get; set; }

        //public int? RecipientId { get; set; }

        public string Content { get; set; }

        [Required]
        public bool HasMedia { get; set; }

        [Required]
        public bool IsSeen { get; set; }

        //[ForeignKey("ParentMessageId")]
        public Message? ParentMessage { get; set; }

        //public int? ParentMessageId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } 

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
