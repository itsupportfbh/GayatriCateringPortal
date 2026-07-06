using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Locations")]
    public class LocationsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "locations";
            ViewData["Title"] = "Locations";
            return View("~/Views/Admin/Locations.cshtml");
        }
    }
}
