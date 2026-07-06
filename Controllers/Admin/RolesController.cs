using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Roles")]
    public class RolesController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "roles";
            ViewData["Title"] = "Roles & Permissions";
            return View("~/Views/Admin/Roles.cshtml");
        }
    }
}
