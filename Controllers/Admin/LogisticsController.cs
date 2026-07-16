using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Logistics")]
    public class LogisticsController : Controller
    {
        private readonly ILogisticsRepository _logisticsRepository;
        private readonly IOrdersRepository _OrderRepository;

        public LogisticsController(ILogisticsRepository logisticsRepository, IOrdersRepository OrderRepository)
        {
            _logisticsRepository = logisticsRepository;
            _OrderRepository = OrderRepository;
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

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _logisticsRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("getDelivered")]
        public IActionResult GetDelivered()
        {
            var items = _logisticsRepository.GetDelivered();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _logisticsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("update")]
        public IActionResult update([FromBody] LogisticsDetails item)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values
                .SelectMany(x => x.Errors)
                .Select(x => x.ErrorMessage));
            }

            if (item == null) return BadRequest();
            int result = _logisticsRepository.Update(item);

            if (result == -1)
            {
                return Ok(new { success = false, message = "Utensil already exists" });
            }


            var updatedStatus = _OrderRepository.UpdateOrderStatus(item.Id, 2);
            if (updatedStatus < 0)
                return BadRequest(new { success = false, message = "Order was not found or could not be updated." });

            return Ok(new { success = true, orderStatus = updatedStatus, message = "Order status updated successfully." });
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
