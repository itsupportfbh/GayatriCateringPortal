using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Settings")]
    public class SettingsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "settings";
            ViewData["Title"] = "Settings";
            return View("~/Views/Admin/Settings.cshtml");
        }
    }
}
