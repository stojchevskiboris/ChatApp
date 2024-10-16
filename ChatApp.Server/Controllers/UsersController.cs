using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("GetAllUsers")]
        public List<UserViewModel> GetAllUsers()
        {
            _logger.LogInformation("Getting all users.");
            var result = _userService.GetAllUsers();
            return result;
        }

        [HttpPost("GetUserById")]
        public UserViewModel GetUserById(int id)
        {
            if (id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.GetUserById(id);
        }

        [HttpPost("GetUserByEmail")]
        public UserViewModel GetUserByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.GetUserByEmail(email);
        }

        [HttpPost("CreateUser")]
        public UserViewModel CreateUser(UserViewModel model)
        {
            var newUser = _userService.CreateUser(model);
            return newUser;
        }

        [HttpPost("DeleteUser")]
        public bool DeleteUser(int userId)
        {
            return _userService.DeleteUser(userId);
        }

        [HttpPost("UpdateUser")]
        public UserViewModel UpdateUser(UserViewModel model)
        {
            return _userService.UpdateUser(model);
        }

        [HttpPost("ChangePassword")]
        public bool ChangePassword(PasswordViewModel model)
        {
            return _userService.ChangePassword(model);
        }
    }
}
