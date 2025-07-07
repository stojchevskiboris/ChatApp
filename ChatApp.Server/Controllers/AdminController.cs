using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Users;
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

        #region Users
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

        [HttpPost("SearchUsers")]
        public IActionResult SearchUsers([FromBody] UserSearchModel model)
        {
            try
            {
                var result = _adminService.SearchUsers(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("SaveOrUpdateUser")]
        public IActionResult SaveOrUpdateUser([FromBody] UserRegisterModel model)
        {
            try
            {

                var result = _adminService.SaveOrUpdateUser(model);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetUserById")]
        public IActionResult GetUserById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                if (model.Id == 0)
                {
                    throw new CustomException("Invalid parameters");
                }
                var result = _adminService.GetUserById(model.Id);
                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteUser")]
        public IActionResult DeleteUser([FromBody] HttpRequestIdModel model)
        {
            try
            {
                if (model.Id == 0)
                {
                    throw new CustomException("Invalid parameters");
                }
                var result = _adminService.DeleteUser(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("ExportUsers")]
        public IActionResult ExportUsers([FromBody] UserSearchModel model)
        {
            try
            {
                var result = _adminService.ExportUsers(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region QueryEditor
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
        #endregion

    }
}
