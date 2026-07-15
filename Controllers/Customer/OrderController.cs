using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [AllowAnonymous]
    [Route("Customer/Order")]
    public class OrderController : Controller
    {
        private readonly IOrdersRepository _orders;
        private readonly IAddOnRepository _addOns;

        public OrderController(IOrdersRepository orders, IAddOnRepository addOns)
        {
            _orders = orders;
            _addOns = addOns;
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

        [HttpGet("addons")]
        public IActionResult GetAddOns()
        {
            try
            {
                var items = _addOns.GetAll()
                    .Where(item => item.IsActive && !item.IsDeleted)
                    .OrderBy(item => item.AddOnName)
                    .ToList();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Unable to load add-ons.", detail = ex.Message });
            }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] CreateOrderRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { success = false, message = "Customer and order details are required." });
            }

            if (string.IsNullOrWhiteSpace(request.Customer.Name))
            {
                return BadRequest(new { success = false, message = "Customer name is required." });
            }

            if (string.IsNullOrWhiteSpace(request.Customer.MobileNo))
            {
                return BadRequest(new { success = false, message = "Customer mobile number is required." });
            }

            try
            {
                int newId = _orders.CreateCompleteOrder(request);
                return Ok(new { success = newId > 0, id = newId, message = "Order submitted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
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
