using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;

namespace ChatApp.Server.Services.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRecipientRepository _recipientRepository;

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
            if (string.IsNullOrEmpty(model.Query))
            {
                return new List<MessageViewModel>();
            }

            var currentUserId = Context.GetCurrentUserId();

            var result = new List<MessageViewModel>();

            if (!string.IsNullOrWhiteSpace(model.Query))
            {
                var queryWords = model.Query.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                result = _messageRepository.GetMessagesBySenderAndRecipient(model.RecipientId, currentUserId).Where(x =>
                    !x.HasMedia &&
                    queryWords.All(word =>
                        x.Content.Trim().ToLower().Contains(word)
                    )
                ).ToList().MapToViewModelList();
            }

            return result;
        }

        public bool SendMessage(MessageViewModel model)
        {
            try
            {
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
                        RecipientUsername = recipient.Username,
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

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var queryWords = searchQuery.ToLower().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                result = result.Where(x =>
                    queryWords.All(word =>
                        x.RecipientFirstName.ToLower().Contains(word) ||
                        x.RecipientLastName.ToLower().Contains(word) ||
                        x.RecipientUsername.ToLower().Contains(word) ||
                        x.Content.ToLower().Contains(word)
                    )
                ).ToList();
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

            var oldestMessageId = oldestMessageAfter?.Id ?? 0;
            if (oldestMessageAfter == null && result.Any())
            {
                oldestMessageId = -1;
            }
            if (!result.Any())
            {
                oldestMessageId = -2;
            }

            return new MessagesChatModel()
            {
                OldestMessageId = oldestMessageId,
                Messages = result.MapToViewModelList()
            };
        }

        public MessagesChatModel FetchMessagesNewerThanMessageId(MessagesHttpRequest model)
        {
            var recipientUser = _userRepository.Get(model.RecipientId);
            var currentUserId = Context.GetCurrentUserId();

            if (recipientUser == null)
            {
                return new MessagesChatModel();
            }

            var oldestMessage = _messageRepository.Get(model.OldestMessageId);

            var result = _messageRepository
                .GetMessagesBySenderAndRecipient(currentUserId, model.RecipientId)
                .Where(x => x.CreatedAt >= oldestMessage.CreatedAt)
                .OrderBy(x => x.CreatedAt)
                .ToList();

            var oldestMessageId = oldestMessage?.Id ?? 0;
            if (oldestMessage == null && result.Any())
            {
                oldestMessageId = -1;
            }
            if (!result.Any())
            {
                oldestMessageId = -2;
            }

            return new MessagesChatModel()
            {
                OldestMessageId = oldestMessageId,
                Messages = result.MapToViewModelList()
            };
        }

        public List<SharedMediaViewModel> GetSharedMedia(int recipientId)
        {
            var currentUserId = Context.GetCurrentUserId();
            var currentUser = _userRepository.Get(currentUserId);
            var recipientUser = _userRepository.Get(recipientId);

            if (recipientUser == null || currentUser == null)
            {
                return new List<SharedMediaViewModel>();
            }

            var sharedMediaMessages = _messageRepository.GetMessagesBySenderAndRecipient(currentUserId, recipientId)
                .Where(x => x.HasMedia && x.MediaContent != null)
                .ToList();

            return sharedMediaMessages.MapToSharedMediaModelList();
        }
    }
}