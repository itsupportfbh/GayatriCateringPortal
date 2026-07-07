using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Track")]
    public class TrackController : Controller
    {
        private readonly ILogisticsRepository _logistics;

        public TrackController(ILogisticsRepository logistics)
        {
            _logistics = logistics;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _logistics.GetAll();
            ViewData["Logistics"] = items;
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "track";
            ViewData["Title"] = "Track Order";
            return View("~/Views/Customer/Track.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _logistics.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{orderNumber}")]
        public IActionResult Get(string orderNumber)
        {
            var item = _logistics.GetByOrderNumber(orderNumber);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] LogisticsDetails item)
        {
            if (item == null) return BadRequest();
            bool result = _logistics.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _logistics.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _logistics.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
