namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class AdminMessageViewModel
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public bool HasMedia { get; set; }
        public bool IsSeen { get; set; }
        public bool IsDeleted { get; set; }
        public int? ParentMessageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
