using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Server.Domain.Models
{
    public class UserContact
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        public int ContactId { get; set; }

        [ForeignKey(nameof(ContactId))]
        public User Contact { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}