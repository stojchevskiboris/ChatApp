namespace ChatApp.Server.Services.ViewModels
{
    public class RequestViewModel
    {
        public int Id { get; set; }

        public int UserFromId { get; set; }

        public int UserToId { get; set; }

        public int RequestStatus { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ModifiedAt { get; set; }
    }
}
