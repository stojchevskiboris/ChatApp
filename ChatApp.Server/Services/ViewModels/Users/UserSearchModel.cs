using ChatApp.Server.Services.ViewModels.Common;

namespace ChatApp.Server.Services.ViewModels.Users
{
    public class UserSearchModel : BaseSearchModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        public DateTime DateOfBirth { get; set; }
        
        public int Gender { get; set; }

        public string Phone { get; set; }

        public DateTime LastActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
