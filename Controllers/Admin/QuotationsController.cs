using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Quotations")]
    public class QuotationsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "quotations";
            ViewData["Title"] = "Quotations";
            return View("~/Views/Admin/Quotations.cshtml");
        }
    }
}
