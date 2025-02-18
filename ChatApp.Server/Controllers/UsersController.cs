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
        private readonly IFirebaseStorageService _firebaseStorageService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger, IFirebaseStorageService firebaseStorageService)
        {
            _userService = userService;
            _logger = logger;
            _firebaseStorageService = firebaseStorageService;
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

        [HttpGet("GetCurrentUserDetails")]
        [Authorize]
        public UserViewModel GetCurrentUserDetails()
        {
            var result = _userService.GetCurrentUserDetails();
            return result;
        }

        [HttpGet("GetContacts")]
        [Authorize]
        public List<UserViewModel> GetContacts()
        {
            return _userService.GetContacts();
        }

        [HttpPost("GetUserByUsername")]
        [Authorize]
        public UserViewModel GetUserByUsername(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.GetUserByUsername(username);
        }

        [HttpPost("RemoveContact")]
        [Authorize]
        public bool RemoveContact(HttpRequestIdModel model)
        {
            if (model.Id == 0)
            {
                throw new CustomException("Invalid parameters");
            }
            return _userService.RemoveContact(model.Id);
        }

        [HttpPost("DeleteUser")]
        [Authorize]
        public bool DeleteUser(int userId)
        {
            return _userService.DeleteUser(userId);
        }

        [HttpPost("UpdateUser")]
        [Authorize]
        public UserViewModel UpdateUser(UpdateUserViewModel model)
        {
            return _userService.UpdateUser(model);
        }

        [HttpPost("UploadProfilePicture")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var imageUrl = await _firebaseStorageService.UploadAvatarFileAsync(file);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Failed to upload profile picture");
            }

            var isImageSaved = _userService.UpdateProfilePicture(imageUrl, file.Length, file.ContentType);
            if (isImageSaved)
            {
                return Ok(new { url = imageUrl });
            }

            return StatusCode(500, "Image uploaded, but failed to save image url to database");
        }

        [HttpPost("RemoveProfilePicture")]
        [Authorize]
        public async Task<IActionResult> RemoveProfilePicture()
        {
            // ToDo firebase remove current user profile picture

            var isImageRemoved = _userService.RemoveCurrentProfilePicture();
            if (isImageRemoved)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost("UpdateLastActive")]
        [Authorize]
        public void UpdateLastActive()
        {
            _userService.UpdateLastActive();
            return;
        }

        [HttpPost("UpdateContactsLastActive")]
        [Authorize]
        public List<LastActiveModel> UpdateContactsLastActive()
        {
            var result = _userService.UpdateContactsLastActive();
            return result;
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
