using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class Group
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        public int CreatedByUserId { get; set; }

        public User CreatedByUser { get; set; }

        public Media? ProfilePicture { get; set; }

        public IList<GroupUser> GroupUsers { get; set; } = new List<GroupUser>();

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
