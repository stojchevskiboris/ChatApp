using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class GroupUser
    {
        public int Id { get; set; }

        [Required]
        public Group Group { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
