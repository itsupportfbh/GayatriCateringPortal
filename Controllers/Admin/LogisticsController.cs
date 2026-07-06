using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Logistics")]
    public class LogisticsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "logistics";
            ViewData["Title"] = "Logistics";
            return View("~/Views/Admin/Logistics.cshtml");
        }
    }
}
