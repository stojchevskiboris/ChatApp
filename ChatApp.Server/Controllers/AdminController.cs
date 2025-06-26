using ChatApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAdminService _adminService;
        private readonly ILogger<UsersController> _logger;

        public AdminController(
            IUserService userService, 
            IAdminService adminService, 
            ILogger<UsersController> logger)
        {
            
        }
    }
}
