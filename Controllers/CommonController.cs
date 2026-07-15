using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GayatriCateringPortal.Controllers
{
    [Route("Common")]
    public class CommonController : Controller
    {
        private readonly ICommonRepository _common;
        private readonly ILogger<CommonController> _logger;

        public CommonController(ICommonRepository common, ILogger<CommonController> logger)
        {
            _common = common;
            _logger = logger;
        }

        [HttpGet("menus")]
        public IActionResult Menus(int roleId)
        {
            if (roleId <= 0)
            {
                return BadRequest(new { success = false, message = "RoleId is required." });
            }

            var items = _common.GetMenuGroups(roleId);
            return Ok(items);
        }

        [HttpGet("GetCountry")]
        public IActionResult GetCountry()
        {
            var items = _common.GetCountry();
            return Ok(items);
        }

        [HttpGet("GetStateByCountryId")]
        public IActionResult GetStateByCountryId(int countryId)
        {
            if (countryId <= 0) return Ok(new List<Models.State>());
            var items = _common.GetStateByCountryId(countryId);
            return Ok(items);
        }

        [HttpGet("GetCityByStateId")]
        public IActionResult GetCityByStateId(int stateId)
        {
            if (stateId <= 0) return Ok(new List<Models.City>());
            var items = _common.GetCityByStateId(stateId);
            return Ok(items);
        }

        [HttpGet("GetEntityMaster")]
        public IActionResult GetEntityMaster()
        {
            var items = _common.GetEntityMaster();
            return Ok(items);
        }

        [HttpPost("CreateRolePermission")]
        public IActionResult CreateRolePermission([FromBody] List<CreateRolePermissionRequest> requests)
        {
            if (requests == null || requests.Count == 0)
            {
                return BadRequest(new { success = false, message = "Invalid request." });
            }

            for (int i = 0; i < requests.Count; i++)
            {
                var request = requests[i];
                if (request == null || request.RoleId <= 0 || request.EntityNo <= 0)
                {
                    return BadRequest(new { success = false, message = "Invalid request." });
                }
            }

            var savedCount = _common.CreateRolePermission(requests);
            return Ok(new { success = savedCount > 0, count = savedCount });
        }

        [HttpGet("GetRolePermissionsByRoleId")]
        public IActionResult GetRolePermissionsByRoleId(int roleId)
        {
            if (roleId <= 0) return Ok(new List<RolePermissionItem>());

            var items = _common.GetRolePermissionsByRoleId(roleId);
            return Ok(items);
        }

        [HttpPost("FileUpload")]
        public async Task<IActionResult> FileUpload(string folderName)
        {
            var dict = new Dictionary<string, object>();

            try
            {
                var httpRequest = HttpContext.Request;

                foreach (var file in httpRequest.Form.Files)
                {
                    var result = await _common.FileUpload(file, folderName);
                    return Created(string.Empty, result);
                }

                dict.Add("error", "Please upload an image or voice recording.");
                return NotFound(dict);
            }
            catch (Exception ex)
            {
                dict.Add("error", "Some error occurred.");
                Exception objErr = ex.GetBaseException();
                _logger.LogError(ex, "Error in Common/FileUpload. BaseError={Error}", objErr.Message);
                return NotFound(dict);
            }
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail([FromForm] SendEmailRequest request)
        {
            try
            {
                byte[]? fileBytes = null;
                string? fileName = null;
                string? contentType = null;

                if (request.Attachment != null && request.Attachment.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await request.Attachment.CopyToAsync(memoryStream);
                    fileBytes = memoryStream.ToArray();
                    fileName = request.Attachment.FileName;
                    contentType = request.Attachment.ContentType;
                }

                await _common.SendEmail(
                    request.ToEmail ?? string.Empty,
                    request.CcEmail,
                    request.Subject ?? string.Empty,
                    request.Body ?? string.Empty,
                    fileBytes,
                    fileName,
                    contentType);

                return Ok(new
                {
                    Message = "Mail sent successfully."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while sending email.");
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }
    }
}
