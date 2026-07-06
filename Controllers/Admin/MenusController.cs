using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Menus")]
    public class MenusController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "menus";
            ViewData["Title"] = "Menu Master";
            return View("~/Views/Admin/Menus.cshtml");
        }
    }
}
