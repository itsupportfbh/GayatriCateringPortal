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
    }
}
