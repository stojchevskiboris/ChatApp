using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class Request
    {
        public int Id { get; set; }

        public int UserFromId { get; set; }

        public User UserFrom { get; set; }

        public int UserToId { get; set; }

        public User UserTo { get; set; }

        public int RequestStatus { get; set; }

        public bool IsDeleted { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
