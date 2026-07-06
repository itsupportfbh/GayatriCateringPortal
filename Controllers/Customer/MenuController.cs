using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Menu")]
    public class MenuController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "menu";
            ViewData["Title"] = "Full Indian Menu";
            return View("~/Views/Customer/Menu.cshtml");
        }
    }
}
