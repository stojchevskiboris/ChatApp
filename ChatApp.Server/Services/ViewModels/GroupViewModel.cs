using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Services.ViewModels
{
    public class GroupViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public User CreatedByUser { get; set; }

        public Media ProfilePicture { get; set; }

        List<User> GroupUsers { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
