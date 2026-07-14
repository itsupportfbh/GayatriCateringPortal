using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers
{
    [Route("Common")]
    public class CommonController : Controller
    {
        private readonly ICommonRepository _common;

        public CommonController(ICommonRepository common)
        {
            _common = common;
        }

        [HttpGet("menus")]
        public IActionResult Menus()
        {
            var items = _common.GetMenuGroups();
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
    }
}
