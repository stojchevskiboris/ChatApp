namespace ChatApp.Server.Services.ViewModels.Users
{
    public class UserAdminModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string? Phone { get; set; }
        public int Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime LastActive { get; set; }
        public int Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
