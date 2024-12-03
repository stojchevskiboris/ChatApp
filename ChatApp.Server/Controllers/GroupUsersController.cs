using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupUsersController : ControllerBase
    {
        private readonly IGroupUserService _groupUserService;

        public GroupUsersController(IGroupUserService groupUserService)
        {
            _groupUserService = groupUserService;
        }

        [HttpGet("GetAllGroupUsers")]
        [Authorize]
        public List<GroupUserViewModel> GetAllGroupUsers()
        {
            var result = _groupUserService.GetAllGroupUsers();
            return result;
        }

        [HttpPost("GetGroupUsersByGroupId")]
        [Authorize]
        public List<GroupUserViewModel> GetGroupUsersByGroupId(int id)
        {
            if (id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _groupUserService.GetGroupUsersByGroupId(id);
        }

        [HttpPost("GetGroupUserById")]
        [Authorize]
        public GroupUserViewModel GetGroupUserById(int id)
        {
            if (id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _groupUserService.GetGroupUserById(id);
        }

        [HttpPost("CreateGroupUser")]
        [Authorize]
        public GroupUserViewModel CreateGroup(GroupUserViewModel model)
        {
            var newGroupUser = _groupUserService.CreateGroupUser(model);
            return newGroupUser;
        }

        [HttpPost("DeleteGroupUser")]
        [Authorize]
        public bool DeleteGroupUser(int id)
        {
            return _groupUserService.DeleteGroupUser(id);
        }

        [HttpPost("DeleteUsersByGroupId")]
        [Authorize]
        public bool DeleteUsersByGroupId(int groupId)
        {
            return _groupUserService.DeleteUsersByGroupId(groupId);
        }

    }
}
