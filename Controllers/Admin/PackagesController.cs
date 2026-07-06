using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Packages")]
    public class PackagesController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Package Config";
            return View("~/Views/Admin/Packages.cshtml");
        }
    }
}
