namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class MessagesHttpRequest
    {
        public int OldestMessageId { get; set; }
        public int RecipientId { get; set; }
    }
}
