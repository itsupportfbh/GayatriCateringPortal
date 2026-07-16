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
            var items = _orders.GetOrderList(fromDate, toDate);
            return Ok(items);
        }

        [HttpPost("UpdateOrderStatus")]
        public IActionResult NextStatus(int id, int status)
        {
            var updatedStatus = _orders.UpdateOrderStatus(id, status);

            return Ok(new { success = true, orderStatus = updatedStatus, message = "Order status updated successfully." });
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


    }
}
