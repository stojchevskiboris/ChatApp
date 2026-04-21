using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Services.Implementations;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.ViewModels.Admin;
using ChatApp.Server.Services.ViewModels.Common;
using ChatApp.Server.Services.ViewModels.Groups;
using ChatApp.Server.Services.ViewModels.Media;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Recipients;
using ChatApp.Server.Services.ViewModels.Requests;
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
                    throw new CustomException("Invalid parameters");
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
                    throw new CustomException("Invalid parameters");
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

        #region Groups
        [HttpPost("SearchGroups")]
        public IActionResult SearchGroups([FromBody] GroupSearchModel model)
        {
            try
            {
                var result = _adminService.SearchGroups(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetGroupById")]
        public IActionResult GetGroupById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetGroupById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("SaveOrUpdateGroup")]
        public IActionResult SaveOrUpdateGroup([FromBody] SaveGroupModel model)
        {
            try
            {
                var result = _adminService.SaveOrUpdateGroup(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteGroup")]
        public IActionResult DeleteGroup([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteGroup(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region GroupUsers
        [HttpPost("SearchGroupUsers")]
        public IActionResult SearchGroupUsers([FromBody] GroupUserSearchModel model)
        {
            try
            {
                var result = _adminService.SearchGroupUsers(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetGroupUserById")]
        public IActionResult GetGroupUserById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetGroupUserById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("SaveGroupUser")]
        public IActionResult SaveGroupUser([FromBody] SaveGroupUserModel model)
        {
            try
            {
                var result = _adminService.SaveGroupUser(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteGroupUser")]
        public IActionResult DeleteGroupUser([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteGroupUser(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region Messages
        [HttpPost("SearchMessages")]
        public IActionResult SearchMessages([FromBody] AdminMessageSearchModel model)
        {
            try
            {
                var result = _adminService.SearchMessages(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetMessageById")]
        public IActionResult GetMessageById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetMessageById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteMessage")]
        public IActionResult DeleteMessage([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteMessage(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region Media
        [HttpPost("SearchMedia")]
        public IActionResult SearchMedia([FromBody] MediaSearchModel model)
        {
            try
            {
                var result = _adminService.SearchMedia(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetMediaById")]
        public IActionResult GetMediaById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetMediaById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteMedia")]
        public IActionResult DeleteMedia([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteMedia(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region Recipients
        [HttpPost("SearchRecipients")]
        public IActionResult SearchRecipients([FromBody] RecipientSearchModel model)
        {
            try
            {
                var result = _adminService.SearchRecipients(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetRecipientById")]
        public IActionResult GetRecipientById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetRecipientById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteRecipient")]
        public IActionResult DeleteRecipient([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteRecipient(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region Requests
        [HttpPost("SearchRequests")]
        public IActionResult SearchRequests([FromBody] RequestSearchModel model)
        {
            try
            {
                var result = _adminService.SearchRequests(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("GetRequestById")]
        public IActionResult GetRequestById([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.GetRequestById(model.Id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateRequest")]
        public IActionResult UpdateRequest([FromBody] UpdateRequestModel model)
        {
            try
            {
                var result = _adminService.UpdateRequest(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteRequest")]
        public IActionResult DeleteRequest([FromBody] HttpRequestIdModel model)
        {
            try
            {
                var result = _adminService.DeleteRequest(model.Id);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        #endregion

        #region Roles
        [HttpPost("SearchRoles")]
        public IActionResult SearchRoles([FromBody] RoleSearchModel model)
        {
            try
            {
                var result = _adminService.SearchRoles(model);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateUserRole")]
        public IActionResult UpdateUserRole([FromBody] RoleUpdateModel model)
        {
            try
            {
                var result = _adminService.UpdateUserRole(model);
                return Ok(new { success = result });
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
