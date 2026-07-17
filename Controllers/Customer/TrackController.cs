using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [AllowAnonymous]
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

        //[HttpPost("save")]
        //public IActionResult Save([FromBody] LogisticsDetails item)
        //{
        //    if (item == null) return BadRequest();
        //    var idValue = 0;
        //    if (!string.IsNullOrWhiteSpace(item.Id)) int.TryParse(item.Id, out idValue);

        //    if (idValue == 0)
        //    {
        //        int newId = _logistics.Create(item);
        //        return Ok(new { success = newId > 0, id = newId });
        //    }

        //    bool result = _logistics.Update(item);
        //    return Ok(new { success = result });
        //}

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
