using System.ComponentModel.DataAnnotations;

namespace ChatApp.Server.Domain.Models
{
    public class Media
    {
        public int Id { get; set; }

        // todo add messageId
        public int? MessageId { get; set; }

        [Required]
        [MaxLength(2048)]
        public string Url { get; set; }

        //[Required]
        //public byte[] FileContent { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileType { get; set; }

        [Required]
        public int FileSize { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ModifiedAt { get; set; }
    }
}
