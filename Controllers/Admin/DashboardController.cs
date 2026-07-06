using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Dashboard")]
    public class DashboardController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "dashboard";
            ViewData["Title"] = "Dashboard";
            return View("~/Views/Admin/Dashboard.cshtml");
        }
    }
}
