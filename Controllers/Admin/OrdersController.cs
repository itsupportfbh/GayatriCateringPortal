using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Orders")]
    public class OrdersController : Controller
    {
        private readonly IOrdersRepository _orders;

        public OrdersController(IOrdersRepository orders)
        {
            _orders = orders;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "orders";
            ViewData["Title"] = "Orders";
            return View("~/Views/Admin/Orders.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            if (userId <= 0) return Unauthorized(new { message = "Please login again." });
            if (fromDate.HasValue && toDate.HasValue && fromDate.Value.Date > toDate.Value.Date)
                return BadRequest(new { message = "From date cannot be later than To date." });

            var items = _orders.GetOrderList(fromDate, toDate);
            return Ok(items);
        }

        [HttpPost("UpdateOrderStatus")]
        public IActionResult NextStatus(int id, int status)
        {
            var userId = HttpContext.Session.GetInt32("UserId") ?? 0;
            if (userId <= 0) return Unauthorized(new { success = false, message = "Please login again." });
            if (status < 0 || status > 4)
                return BadRequest(new { success = false, message = "Invalid order status." });

            var updatedStatus = _orders.UpdateOrderStatus(id, status);
            if (updatedStatus < 0)
                return BadRequest(new { success = false, message = "Order was not found or could not be updated." });

            return Ok(new { success = true, orderStatus = updatedStatus, message = "Order status updated successfully." });
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _orders.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Orders item)
        {
            if (item == null) return BadRequest();
            var idValue = item.Id;

            if (idValue == 0)
            {
                int newId = _orders.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _orders.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _orders.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _orders.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
