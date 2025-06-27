using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Admin;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<UsersController> _logger;

        public AdminController(IAdminService adminService, ILogger<UsersController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpGet("GetCurrentUserRole")]
        public IActionResult GetCurrentUserRole()
        {
            try
            {
                var role = _adminService.GetCurrentUserRole();
                return Ok(role);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RunSql")]
        public IActionResult RunSql(SqlQueryRequest request)
        {
            try
            {
                var result = _adminService.ExecuteQuery(request.Query);
                return Ok(new { success = true, message = result.Message, columns = result.Columns, rows = result.Rows });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
