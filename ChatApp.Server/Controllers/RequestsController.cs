using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
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

        [HttpPost("NewRequestByUserId")]
        [Authorize]
        public bool NewRequestByUserId(NewRequestModel model)
        {
            var result = _requestService.RequestByUserId(model);
            return result;
        }

        
    }
}
