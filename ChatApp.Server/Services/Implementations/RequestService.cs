using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels;

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
            var users = _userRepository.SearchUsersToAdd(currentUserId, query.Trim());
            if (users == null)
            {
                //throw new CustomException($"No results found");
                return new List<AddUserModel>();
            }

            var result = users
                .ToList()
                .MapToAddUserModelList();

            var pendingRequestsForCurrentUser = _requestRepository.GetPendingRequestsFromCurrentUser(currentUserId);

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

        public bool ApproveRequest(int id)
        {
            throw new NotImplementedException();
        }

        public bool RejectRequest(int id)
        {
            throw new NotImplementedException();
        }
    }
}
