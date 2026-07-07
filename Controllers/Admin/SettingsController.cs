using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Settings")]
    public class SettingsController : Controller
    {
        private readonly ISettingsRepository _repo;

        public SettingsController(ISettingsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var settings = _repo.GetSettings();
            ViewData["Settings"] = settings;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "settings";
            ViewData["Title"] = "Settings";
            return View("~/Views/Admin/Settings.cshtml");
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] object settings)
        {
            if (settings == null) return BadRequest();
            bool result = _repo.Update(settings);
            return Ok(new { success = result });
        }
    }
}
