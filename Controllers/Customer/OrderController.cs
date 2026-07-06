using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Order")]
    public class OrderController : Controller
    {
        private readonly IOrdersRepository _orders;

        public OrderController(IOrdersRepository orders)
        {
            _orders = orders;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "order";
            ViewData["Title"] = "Place Order";
            return View("~/Views/Customer/Order.cshtml");
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
            int result = _orders.CreateOrUpdate(item);
            return Ok(new { success = result > 0 });
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
