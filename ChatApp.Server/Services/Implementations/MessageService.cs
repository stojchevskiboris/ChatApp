using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
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

                if (model.HasMedia)
                {
                    if (model.Media == null)
                    {
                        throw new Exception("media is null");
                    }

                    Media mediaContent = new Media()
                    {
                        MessageId = message.Id,
                        Url = model.Media.Url,
                        FileType = model.Media.FileType,
                        FileSize = model.Media.FileSize,
                        CreatedAt = DateTime.Now,
                        ModifiedAt = DateTime.Now
                    };

                    message.MediaContent = mediaContent;

                    _messageRepository.Update(message);
                }

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

        public List<RecentChatViewModel> GetRecentChats(string searchQuery)
        {
            var currentUserId = Context.GetCurrentUserId();
            var user = _userRepository.Get(currentUserId);
            if (user == null)
            {
                throw new CustomException("User not existing");
            }

            var result = new List<RecentChatViewModel>();

            var contactIds = _userRepository.GetContactsByUserId(currentUserId);
            if (contactIds.Count == 0)
            {
                return new List<RecentChatViewModel>();
            }

            var query = _messageRepository.GetMessagesSentOrReceivedByUser(currentUserId);

            if (!query.Any())
            {
                return new List<RecentChatViewModel>();
            }

            foreach (var c in contactIds)
            {
                if (query.Any(x => x.Recipient.RecipientUser.Id == c || x.Sender.Id == c))
                {
                    var mostRecentMessage = query.Where(x => x.Recipient.RecipientUser.Id == c || x.Sender.Id == c).FirstOrDefault();
                    if (mostRecentMessage == null)
                    {
                        continue;
                    }
                    var isSentMessage = mostRecentMessage.Sender.Id == currentUserId;

                    var recipient = isSentMessage ?
                        mostRecentMessage.Recipient.RecipientUser : mostRecentMessage.Sender;

                    result.Add(new RecentChatViewModel()
                    {
                        Id = mostRecentMessage.Id,
                        RecipientId = recipient.Id,
                        RecipientFirstName = recipient.FirstName,
                        RecipientLastName = recipient.LastName,
                        RecipientProfilePicture = recipient.ProfilePicture?.Url,
                        Content = mostRecentMessage.Content,
                        HasMedia = mostRecentMessage.HasMedia,
                        MediaType = mostRecentMessage.MediaContent?.FileType ?? string.Empty,
                        IsSeen = isSentMessage ? true : mostRecentMessage.IsSeen,
                        IsSentMessage = isSentMessage,
                        ParentMessageId = mostRecentMessage.ParentMessage?.Id,
                        CreatedAt = mostRecentMessage.CreatedAt,
                        ModifiedAt = mostRecentMessage.ModifiedAt,
                    });
                }
            }

            return result.OrderByDescending(x => x.CreatedAt).ToList();
        }

        public bool SetMessageSeen(int messageId)
        {
            var currentUserId = Context.GetCurrentUserId();

            var message = _messageRepository.Get(messageId);
            if (message != null)
            {
                message.IsSeen = true;
                _messageRepository.Update(message);
                return true;
            }

            return false;
        }

        public MessagesChatModel GetRecentMessages(int recipientUserId)
        {
            var recipientUser = _userRepository.Get(recipientUserId);
            var currentUserId = Context.GetCurrentUserId();


            if (recipientUser == null)
            {
                return new MessagesChatModel();
            }

            var result = _messageRepository
                .GetMessagesBySenderAndRecipient(currentUserId, recipientUserId)
                .Take(30)
                .OrderBy(x => x.CreatedAt)
                .ToList();

            var oldestMessage = result.FirstOrDefault();
            var lastMessageId = oldestMessage?.Id ?? 0;
            if (oldestMessage == null && result.Any())
            {
                lastMessageId = -1;
            }

            return new MessagesChatModel()
            {
                OldestMessageId = lastMessageId,
                Messages = result.MapToViewModelList()
            };
        }
        public MessagesChatModel FetchOlderMessages(MessagesHttpRequest model)
        {
            var recipientUser = _userRepository.Get(model.RecipientId);
            var currentUserId = Context.GetCurrentUserId();


            if (recipientUser == null)
            {
                return new MessagesChatModel();
            }

            var oldestMessageBefore = _messageRepository.Get(model.OldestMessageId);

            var result = _messageRepository
                .GetMessagesBySenderAndRecipient(currentUserId, model.RecipientId)
                .Where(x => x.CreatedAt < oldestMessageBefore.CreatedAt)
                .Take(30)
                .OrderBy(x => x.CreatedAt)
                .ToList();

            var oldestMessageAfter = result.FirstOrDefault();

            var lastMessageId = oldestMessageAfter?.Id ?? 0;
            if (oldestMessageAfter == null && result.Any())
            {
                lastMessageId = -1;
            }
            if (!result.Any())
            {
                lastMessageId = -2;
            }

            return new MessagesChatModel()
            {
                OldestMessageId = lastMessageId,
                Messages = result.MapToViewModelList()
            };
        }
    }
}
