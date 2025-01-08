namespace ChatApp.Server.Services.ViewModels.Users
{
    public class UserViewModel
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        //public string Password { get; set; }

        public DateTime DateOfBirth { get; set; }
        
        public int Gender { get; set; }

        public string Phone { get; set; }

        public string ProfilePicture { get; set; }

        public List<int> ContactsId { get; set; } = new List<int>();

        public DateTime LastActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
