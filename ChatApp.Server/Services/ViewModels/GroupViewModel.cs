namespace ChatApp.Server.Services.ViewModels
{
    public class GroupViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public UserViewModel? CreatedByUser { get; set; }

        //public Media? ProfilePicture { get; set; }

        List<UserViewModel> GroupUsers { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
