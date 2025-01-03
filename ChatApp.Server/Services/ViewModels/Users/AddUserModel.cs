namespace ChatApp.Server.Services.ViewModels.Users
{
    public class AddUserModel
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string ProfilePicture { get; set; }

        public bool IsAdded { get; set; }

        public bool HasRequestedBack { get; set; }

        public int? RequestId { get; set; }

        public string Email { get; set; }

        //public DateTime DateOfBirth { get; set; }

        //public string Phone { get; set; }
    }
}
