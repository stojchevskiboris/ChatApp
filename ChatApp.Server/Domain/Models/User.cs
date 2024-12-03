using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(255)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        public string Phone { get; set; }

        public Media? ProfilePicture { get; set; }

        // ToDo: Add contacts (User[])

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
