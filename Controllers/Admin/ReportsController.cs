using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Reports")]
    public class ReportsController : Controller
    {
        private readonly IReportsRepository _reportsRepository;

        public ReportsController(IReportsRepository reportsRepository)
        {
            _reportsRepository = reportsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "reports";
            ViewData["Title"] = "Reports";
            return View("~/Views/Admin/Reports.cshtml");
        }

        [HttpGet("get/{name}")]
        public IActionResult Get(string name)
        {
            var report = _reportsRepository.GetReport(name);
            if (report == null) return NotFound();
            return Ok(report);
        }
    }
}
