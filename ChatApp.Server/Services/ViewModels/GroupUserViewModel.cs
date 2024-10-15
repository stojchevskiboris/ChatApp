using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Services.ViewModels
{
    public class GroupUserViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int GroupId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
