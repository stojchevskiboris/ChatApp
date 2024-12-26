namespace ChatApp.Server.Services.ViewModels.Users
{
    public class UpdateUserViewModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime DateOfBirth { get; set; }
        
        public bool Gender { get; set; }

        public string Phone { get; set; }
    }
}
