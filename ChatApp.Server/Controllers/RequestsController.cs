using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestsController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet("GetAllRequests")]
        public List<RequestViewModel> GetAllRequests()
        {
            var result = _requestService.GetAllRequests();
            return result;
        }


        [HttpPost("SearchUsersToAdd")]
        [Authorize]
        public List<AddUserModel> SearchUsersToAdd(HttpRequestQueryModel model)
        {
            if (string.IsNullOrEmpty(model.Query))
            {
                return new List<AddUserModel>();
            }
            return _requestService.SearchUsersToAdd(model.Query);
        }

        [HttpPost("NewRequest")]
        [Authorize]
        public bool NewRequest(HttpRequestIdModel model)
        {
            var result = _requestService.NewRequest(model.Id);
            return result;
        }

        [HttpPost("CancelRequest")]
        [Authorize]
        public bool CancelRequest(HttpRequestIdModel model)
        {
            var result = _requestService.CancelRequest(model.Id);
            return result;
        }
    }
}