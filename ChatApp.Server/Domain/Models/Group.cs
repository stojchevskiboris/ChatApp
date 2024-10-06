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
        public User CreatedByUser { get; set; }

        public Media? ProfilePicture { get; set; }

        //List<User> GroupUsers { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }

        //public Group()
        //{
        //    GroupUsers = new List<User>();
        //}
    }
}
