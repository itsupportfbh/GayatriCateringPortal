using GayatriCateringPortal.Interfaces;
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
    }
}
