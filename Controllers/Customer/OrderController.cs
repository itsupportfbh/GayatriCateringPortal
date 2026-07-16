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
                var currentUserId = HttpContext.Session.GetInt32("UserId") ?? 0;
                if (currentUserId > 0)
                {
                    request.Customer.CreatedBy = currentUserId;
                    request.Order.CreatedBy = currentUserId;
                }
                int orderId = request.Order.Id > 0
                    ? _orders.UpdateCompleteOrder(request)
                    : _orders.CreateCompleteOrder(request);
                var message = request.Order.Id > 0 ? "Order updated successfully." : "Order submitted successfully.";
                return Ok(new { success = orderId > 0, id = orderId, message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

       
    }
}
