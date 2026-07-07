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
            var list = _orders.GetAll();
            ViewData["Orders"] = list;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "orders";
            ViewData["Title"] = "Orders";
            return View("~/Views/Admin/Orders.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _orders.GetAll();
            return Ok(items);
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
            if (item.Id == 0)
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
