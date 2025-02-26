namespace ChatApp.Server.Services.ViewModels.Messages
{
    public class MessagesChatModel
    {
        public int OldestMessageId { get; set; }
        public List<MessageViewModel> Messages { get; set; }

        public MessagesChatModel()
        {
            Messages = new List<MessageViewModel>();
        }
    }
}
