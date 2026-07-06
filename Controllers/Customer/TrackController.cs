using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Track")]
    public class TrackController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "track";
            ViewData["Title"] = "Track Order";
            return View("~/Views/Customer/Track.cshtml");
        }
    }
}
