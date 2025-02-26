namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class RecentChatViewModel
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public string RecipientUsername { get; set; }
        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }
        public string RecipientProfilePicture {  get; set; }
        public string Content { get; set; }
        public bool HasMedia { get; set; }
        public string MediaType { get; set; }
        public bool IsSeen { get; set; }
        public bool IsSentMessage { get; set; }
        public int? ParentMessageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
