using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRecipientRepository _recipientRepository;
        private static readonly List<MessageViewModel> _messages = new()
        {
            new MessageViewModel
            {
                Id = 1,
                SenderId = 101,
                RecipientId = 201,
                Content = "Hello, how are you?",
                HasMedia = false,
                IsSeen = true,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-15)
            },
            new MessageViewModel
            {
                Id = 2,
                SenderId = 101,
                RecipientId = 201,
                Content = "Are we still on for the meeting?",
                HasMedia = false,
                IsSeen = false,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-10),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-10)
            },
            new MessageViewModel
            {
                Id = 3,
                SenderId = 201,
                RecipientId = 101,
                Content = "Yes, I'll be there at 3 PM.",
                HasMedia = false,
                IsSeen = true,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new MessageViewModel
            {
                Id = 4,
                SenderId = 101,
                RecipientId = 301,
                Content = "This is unrelated to the current recipient.",
                HasMedia = false,
                IsSeen = false,
                ParentMessage = null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-20),
                ModifiedAt = DateTime.UtcNow.AddMinutes(-20)
            }
        };
        
        public MessageService(
            IMessageRepository messageRepository,
            IUserRepository userRepository,
            IRecipientRepository recipientRepository)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _recipientRepository = recipientRepository;
        }

        public List<MessageViewModel> SearchMessages(MessageSearchModel model)
        {
            return _messages;
        }

        public bool SendMessage(MessageViewModel model)
        {
            try
            {
                // validate model
                var sender = _userRepository.Get(model.SenderId);
                var userRecipient = _userRepository.Get(model.RecipientId);

                if (sender == null || userRecipient == null)
                {
                    throw new CustomException("Invalid sender or recipient");
                }

                var recipient = EnsureRecipient(sender, userRecipient);

                var message = new Message()
                {
                    Sender = sender,
                    Recipient = recipient,
                    Content = model.Content,
                    HasMedia = model.HasMedia,
                    IsSeen = false,
                    ParentMessage = null,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                };

                _messageRepository.Create(message);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private Recipient EnsureRecipient(User sender, User userRecipient)
        {
            var recipient = _recipientRepository.GetByUserId(userRecipient.Id);
            if (recipient == null)
            {
                recipient = new Recipient()
                {
                    RecipientUser = userRecipient,
                    RecipientTypeId = 1,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                };

                _recipientRepository.Create(recipient);
            }

            return recipient;
        }
    }
}
