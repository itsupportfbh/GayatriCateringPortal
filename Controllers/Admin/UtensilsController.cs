using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Utensils")]
    public class UtensilsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "utensils";
            ViewData["Title"] = "Utensils Config";
            return View("~/Views/Admin/Utensils.cshtml");
        }
    }
}
