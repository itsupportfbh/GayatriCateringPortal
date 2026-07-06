using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Finance")]
    public class FinanceController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "finance";
            ViewData["Title"] = "Finance & Payments";
            return View("~/Views/Admin/Finance.cshtml");
        }
    }
}
