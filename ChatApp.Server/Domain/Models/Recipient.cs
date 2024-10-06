using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class Recipient
    {
        public int Id { get; set; }

        [Required]
        public int RecipientTypeId { get; set; }

        public User? RecipientUser { get; set; }

        public Group? RecipientGroup { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
