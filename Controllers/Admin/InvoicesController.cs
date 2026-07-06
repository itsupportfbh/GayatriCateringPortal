using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Invoices")]
    public class InvoicesController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "invoices";
            ViewData["Title"] = "Invoices";
            return View("~/Views/Admin/Invoices.cshtml");
        }
    }
}
