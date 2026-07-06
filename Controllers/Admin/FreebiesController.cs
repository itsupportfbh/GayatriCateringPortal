using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Freebies")]
    public class FreebiesController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "freebies";
            ViewData["Title"] = "Popular & Freebies";
            return View("~/Views/Admin/Freebies.cshtml");
        }
    }
}
