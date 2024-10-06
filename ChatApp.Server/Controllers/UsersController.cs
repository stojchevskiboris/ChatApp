using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public List<UserViewModel> GetAll()
        {
            var result = _userService.GetAllUsers();
            return result;
        }

        [HttpPost]
        public UserViewModel Create(UserViewModel model)
        {
            return _userService.CreateUser(model);
        }
    }
}
