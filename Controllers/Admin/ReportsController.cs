using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Reports")]
    public class ReportsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "reports";
            ViewData["Title"] = "Reports";
            return View("~/Views/Admin/Reports.cshtml");
        }
    }
}
