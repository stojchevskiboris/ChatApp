using ChatApp.Server.Common.Exceptions;
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

        public bool RequestByUserId(NewRequestModel model)
        {
            if (model.UserFromId == 0 || model.UserToId == 0)
            {
                return false;
            }

            var userFrom = _userRepository.Get(model.UserFromId);
            var userTo = _userRepository.Get(model.UserToId);

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

        public bool CancelRequestById(int id)
        {
            throw new NotImplementedException();
        }

        public bool ApproveRequestById(int id)
        {
            throw new NotImplementedException();
        }

        public bool RejectRequestById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
