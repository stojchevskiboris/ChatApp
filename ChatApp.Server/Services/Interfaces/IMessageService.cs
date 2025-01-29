using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Interfaces
{
    public interface IMessageService
    {
        List<MessageViewModel> SearchMessages(MessageSearchModel model);
        bool SendMessage(MessageViewModel model);
    }
}
