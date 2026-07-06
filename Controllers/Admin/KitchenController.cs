using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Kitchen")]
    public class KitchenController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "kitchen";
            ViewData["Title"] = "Kitchen Queue";
            return View("~/Views/Admin/Kitchen.cshtml");
        }
    }
}
