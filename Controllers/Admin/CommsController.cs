using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Comms")]
    public class CommsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "comms";
            ViewData["Title"] = "Communication Log";
            return View("~/Views/Admin/Comms.cshtml");
        }
    }
}
