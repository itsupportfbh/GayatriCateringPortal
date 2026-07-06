using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Packages")]
    public class PackagesController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Indian Packages";
            return View("~/Views/Customer/Packages.cshtml");
        }
    }
}
