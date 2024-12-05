namespace ChatApp.Server.Services.ViewModels.Groups
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
