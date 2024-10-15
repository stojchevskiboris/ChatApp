using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupsController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        // ToDo: implement api calls
    }
}
