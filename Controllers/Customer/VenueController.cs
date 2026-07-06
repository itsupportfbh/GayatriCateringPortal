using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Venue")]
    public class VenueController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "venue";
            ViewData["Title"] = "Function Hall";
            return View("~/Views/Customer/Venue.cshtml");
        }
    }
}
