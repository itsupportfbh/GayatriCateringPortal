using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/MealPeriods")]
    public class MealPeriodsController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "mealperiods";
            ViewData["Title"] = "Meal Periods";
            return View("~/Views/Admin/MealPeriods.cshtml");
        }
    }
}
