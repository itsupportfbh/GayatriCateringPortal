using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Logistics")]
    public class LogisticsController : Controller
    {
        private readonly ILogisticsRepository _logisticsRepository;

        public LogisticsController(ILogisticsRepository logisticsRepository)
        {
            _logisticsRepository = logisticsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _logisticsRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "logistics";
            ViewData["Title"] = "Logistics";
            return View("~/Views/Admin/Logistics.cshtml");
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _logisticsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] LogisticsDetails item)
        {
            if (item == null) return BadRequest();
            bool result = _logisticsRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _logisticsRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _logisticsRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
