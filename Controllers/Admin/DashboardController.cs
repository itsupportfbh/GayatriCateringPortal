using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Dashboard")]
    public class DashboardController : Controller
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardController(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var summary = _dashboardRepository.GetSummary();
            ViewData["Summary"] = summary;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "dashboard";
            ViewData["Title"] = "Dashboard";
            return View("~/Views/Admin/Dashboard.cshtml");
        }
    }
}
