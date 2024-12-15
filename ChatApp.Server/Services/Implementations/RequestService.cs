using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Requests;
using ChatApp.Server.Services.ViewModels.Users;
using Serilog;

namespace ChatApp.Server.Services.Implementations
{
    public class RequestService : IRequestService
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IUserRepository _userRepository;

        public RequestService(
            IRequestRepository requestRepository,
            IUserRepository userRepository)
        {
            _requestRepository = requestRepository;
            _userRepository = userRepository;
        }

        public List<RequestViewModel> GetAllRequests()
        {
            return _requestRepository.GetAll()
                .ToList()
                .MapToViewModelList();
        }

        public List<AddUserModel> SearchUsersToAdd(string query)
        {
            var currentUserId = Context.GetCurrentUserId();
            var currentUser = _userRepository.Get(currentUserId);
            if (currentUser == null)
            {
                throw new CustomException("User not existing");
            }

            List<int> userContactIds = new List<int>();
            if (currentUser.Contacts.Any())
            {
                userContactIds = currentUser.Contacts.Select(x => x.ContactId).ToList();
            }

            var users = _userRepository.SearchUsersToAdd(currentUserId, query.Trim(), userContactIds);
            if (users == null)
            {
                //throw new CustomException($"No results found");
                return new List<AddUserModel>();
            }

            var result = users
                .ToList()
                .MapToAddUserModelList();

            var pendingRequestsForCurrentUser = _requestRepository.GetPendingRequestsSentFromCurrentUser(currentUserId);

            if (pendingRequestsForCurrentUser.Any())
            {
                foreach (var user in result)
                {
                    foreach (var request in pendingRequestsForCurrentUser)
                    {
                        if (request.UserTo.Id == user.Id)
                        {
                            user.IsAdded = true;
                        }
                    }
                }
            }
            return result;
        }

        public List<RequestDetailsModel> GetPendingRequests()
        {
            var currentUserId = Context.GetCurrentUserId();

            var pendingRequests = _requestRepository.GetPendingRequests(currentUserId);

            if (pendingRequests.Any())
            {
                return pendingRequests.MapToRequestDetailsModelList();
            }
            return new List<RequestDetailsModel>();
        }

        public List<RequestDetailsModel> GetArchivedRequests()
        {
            var currentUserId = Context.GetCurrentUserId();

            var archivedRequests = _requestRepository.GetArchivedRequests(currentUserId);

            if (archivedRequests.Any())
            {
                return archivedRequests.MapToRequestDetailsModelList();
            }
            return new List<RequestDetailsModel>();
        }

        public bool NewRequest(int userToId)
        {
            var currentUserId = Context.GetCurrentUserId();
            var userFrom = _userRepository.Get(currentUserId);
            var userTo = _userRepository.Get(userToId);

            if (userFrom == null || userTo == null)
            {
                return false;
            }

            if (userFrom.Id == userTo.Id)
            {
                throw new CustomException("The new contact must be different than current user");
            }

            var existingRequest = _requestRepository.HasExistingActiveRequest(userFrom.Id, userTo.Id);
            if (existingRequest)
            {
                throw new CustomException("The contact already has pending request from you");
            }

            var request = new Request()
            {
                UserFrom = userFrom,
                UserTo = userTo,
                RequestStatus = (int)RequestStatusEnum.Pending,
                IsDeleted = false,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now,
            };

            _requestRepository.Create(request);

            return true;
        }

        public bool CancelRequest(int userToId)
        {
            var currentUserId = Context.GetCurrentUserId();
            var userFrom = _userRepository.Get(currentUserId);
            var userTo = _userRepository.Get(userToId);

            if (userFrom == null || userTo == null)
            {
                return false;
            }

            if (userFrom.Id == userTo.Id)
            {
                throw new CustomException("The new contact must be different than current user");
            }

            if (_userRepository.HasInContacts(userFrom, userToId))
            {
                throw new CustomException("Cannot cancel request, user has accepted your invitation");
            }

            var request = _requestRepository.GetByUserIds(userFrom.Id, userTo.Id).FirstOrDefault();
            if (request != null)
            {
                request.RequestStatus = (int)RequestStatusEnum.Canceled;
                request.IsDeleted = true;
                request.ModifiedAt = DateTime.Now;

                _requestRepository.Update(request);
            }

            return true;
        }

        public bool AcceptRequest(int requestId)
        {
            var request = _requestRepository.Get(requestId);
            if (request == null)
            {
                throw new CustomException("The request does not exist");
            }

            var user1 = _userRepository.Get(request?.UserFrom?.Id ?? -1);
            var user2 = _userRepository.Get(request?.UserTo?.Id ?? -1);

            if (user1 == null || user2 == null)
            {
                throw new CustomException("Users not existing in system");
            }

            try
            {
                if (!_userRepository.HasInContacts(user1, user2.Id))
                {
                    var contact = new UserContact()
                    {
                        UserId = user1.Id,
                        User = user1,
                        ContactId = user2.Id,
                        Contact = user2,
                        CreatedAt = DateTime.Now
                    };
                    user1.Contacts.Add(contact);
                    _userRepository.Update(user1);
                }

                if (!_userRepository.HasInContacts(user2, user1.Id))
                {
                    var contact = new UserContact()
                    {
                        UserId = user2.Id,
                        User = user2,
                        ContactId = user1.Id,
                        Contact = user1,
                        CreatedAt = DateTime.Now
                    };
                    user2.Contacts.Add(contact);
                    _userRepository.Update(user2);
                }

                request.RequestStatus = (int)RequestStatusEnum.Accepted;
                _requestRepository.Update(request);

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public bool RejectRequest(int requestId)
        {
            var request = _requestRepository.Get(requestId);
            if (request == null)
            {
                throw new CustomException("The request does not exist");
            }

            var user1 = _userRepository.Get(request?.UserFrom?.Id ?? -1);
            var user2 = _userRepository.Get(request?.UserTo?.Id ?? -1);

            if (user1 == null || user2 == null)
            {
                throw new CustomException("Users not existing in system");
            }

            try
            {
                if (_userRepository.HasInContacts(user1, user2.Id)) // ensure there arent contacts between each other
                {
                    var possibleContacts = user1.Contacts.Where(x => x.UserId == user1.Id && x.ContactId == user2.Id).ToList();
                    if (possibleContacts.Any())
                    {
                        foreach (var contact in possibleContacts)
                        {
                            user1.Contacts.Remove(contact);
                        }
                    }
                    _userRepository.Update(user1);
                }

                if (_userRepository.HasInContacts(user2, user1.Id)) // ensure there arent contacts between each other
                {
                    var possibleContacts = user2.Contacts.Where(x => x.UserId == user2.Id && x.ContactId == user1.Id).ToList();
                    if (possibleContacts.Any())
                    {
                        foreach (var contact in possibleContacts)
                        {
                            user2.Contacts.Remove(contact);
                        }
                    }
                    _userRepository.Update(user1);
                }

                request.RequestStatus = (int)RequestStatusEnum.Rejected;
                _requestRepository.Update(request);

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }
    }
}
