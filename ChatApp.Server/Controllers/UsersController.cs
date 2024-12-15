using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Users;
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
        [Authorize]
        public List<UserViewModel> GetAllUsers()
        {
            _logger.LogInformation("Getting all users.");
            var result = _userService.GetAllUsers();
            return result;
        }

        [HttpPost("GetUserById")]
        [Authorize]
        public UserViewModel GetUserById(HttpRequestIdModel model)
        {
            if (model.Id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.GetUserById(model.Id);
        }

        [HttpGet("GetContacts")]
        [Authorize]
        public List<UserViewModel> GetContacts()
        {
            return _userService.GetContacts();
        }

        [HttpPost("GetUserByEmail")]
        [Authorize]
        public UserViewModel GetUserByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.GetUserByEmail(email);
        }

        [HttpPost("DeleteUser")]
        [Authorize]
        public bool DeleteUser(int userId)
        {
            return _userService.DeleteUser(userId);
        }

        [HttpPost("UpdateUser")]
        [Authorize]
        public UserViewModel UpdateUser(UserViewModel model)
        {
            return _userService.UpdateUser(model);
        }

        #region Authorization
        [HttpPost("ChangePassword")]
        [Authorize]
        public bool ChangePassword(PasswordViewModel model)
        {
            return _userService.ChangePassword(model);
        }

        [HttpPost("Register")]
        public UserViewModel CreateUser(UserRegisterModel model)
        {
            var newUser = _userService.CreateUser(model);
            return newUser;
        }

        [HttpPost("Login")]
        public IActionResult Authenticate(AuthenticateRequest model)
        {
            var response = _userService.Authenticate(model);

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(response);
        }

        [HttpPost("SessionLogin")]
        public IActionResult SessionLogin(TokenRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Token))
            {
                return BadRequest(new { message = "Session expired, please log in again." });
            }

            var response = _userService.AuthenticateWithJwt(model.Token);

            return Ok(response);
        }
        #endregion
    }
}
