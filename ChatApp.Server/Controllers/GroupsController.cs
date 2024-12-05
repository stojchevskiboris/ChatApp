using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Groups;
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

        [HttpGet("GetAllGroups")]
        [Authorize]
        public List<GroupViewModel> GetAllGroups()
        {
            var result = _groupService.GetAllGroups();
            return result;
        }

        [HttpPost("GetGroupById")]
        [Authorize]
        public GroupViewModel GetGroupById(int id)
        {
            if (id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _groupService.GetGroupById(id);
        }

        [HttpPost("CreateGroup")]
        [Authorize]
        public GroupViewModel CreateGroup(GroupViewModel model)
        {
            var newGroup = _groupService.CreateGroup(model);
            return newGroup;
        }

        [HttpPost("UpdateGroup")]
        [Authorize]
        public GroupViewModel UpdateGroup(GroupViewModel model)
        {
            return _groupService.UpdateGroup(model);
        }

        [HttpPost("DeleteGroup")]
        [Authorize]
        public bool DeleteGroup(int groupId)
        {
            return _groupService.DeleteGroup(groupId);
        }
    }
}
