using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using GayatriCateringPortal.Interfaces.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
namespace GayatriCateringPortal.Controllers.Customer
{
    [AllowAnonymous]
    [Route("Customer/Order")]
    public class OrderController : Controller
    {
        private readonly IOrdersRepository _orders;
        private readonly IAddOnRepository _addOns;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IEventMasterRepository _events;
        private readonly IPackageRepository _packages;
        private readonly IMealPeriodsRepository _mealPeriods;
        private readonly IUtensilsRepository _utensils;

        public OrderController(IOrdersRepository orders, IAddOnRepository addOns, IConfiguration configuration,
            IHttpClientFactory httpClientFactory, IEventMasterRepository events,
            IPackageRepository packages, IMealPeriodsRepository mealPeriods,
            IUtensilsRepository utensils)
        {
            _orders = orders;
            _addOns = addOns;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _events = events;
            _packages = packages;
            _mealPeriods = mealPeriods;
            _utensils = utensils;
        }

        [HttpGet("events")]
        public IActionResult GetEvents() => Ok(_events.GetAll()
            .Where(item => item.IsActive && item.IsDeleted != true)
            .OrderBy(item => item.Name)
            .Select(item => new
            {
                id = item.Id,
                name = item.Name,
                minPax = item.MinPax,
                advanceBookingDays = item.AdvanceBookingDays
            }));

        [HttpGet("events/{eventId:int}/packages")]
        public IActionResult GetEventPackages(int eventId)
        {
            if (eventId <= 0) return BadRequest(new { message = "A valid event is required." });
            return Ok(_packages.GetByEventId(eventId));
        }

        [HttpGet("meal-periods")]
        public IActionResult GetMealPeriods()
        {
            try
            {
                var items = _mealPeriods.GetAll()
                    .Where(item => item.IsActive && item.IsDeleted != true)
                    .OrderBy(item => item.DisplayOrder)
                    .Select(item => new
                    {
                        id = item.Id,
                        mealPeriodName = item.MealPeriodName,
                        displayOrder = item.DisplayOrder
                    })
                    .ToList();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Unable to load meal periods.", detail = ex.Message });
            }
        }

        [HttpGet("utensils")]
        public IActionResult GetUtensils()
        {
            try
            {
                var items = _utensils.GetAll()
                    .Where(item => item.IsActive && !item.IsDeleted)
                    .OrderBy(item => item.UtensilName)
                    .Select(item => new
                    {
                        id = item.Id,
                        utensilName = item.UtensilName,
                        ruleType = item.RuleType,
                        ruleOperator = item.RuleOperator,
                        ruleValue = item.RuleValue,
                        rulePercentage = item.RulePercentage,
                        minimumQty = item.MinimumQty,
                        ruleDescription = item.RuleDescription,
                        price = item.Price,
                        depositAmount = item.DepositAmount
                    })
                    .ToList();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Unable to load utensils.", detail = ex.Message });
            }
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

            if (!request.Order.EventId.HasValue || !request.Order.EventDate.HasValue)
            {
                return BadRequest(new { success = false, message = "Event and event date are required." });
            }

            var selectedEvent = _events.GetById(request.Order.EventId.Value);
            if (selectedEvent == null || !selectedEvent.IsActive || selectedEvent.IsDeleted)
            {
                return BadRequest(new { success = false, message = "The selected event is not available." });
            }

            var minimumEventDate = DateTime.Today.AddDays(Math.Max(0, selectedEvent.AdvanceBookingDays));
            if (request.Order.EventDate.Value.Date < minimumEventDate)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"{selectedEvent.Name} must be booked at least {selectedEvent.AdvanceBookingDays} day(s) in advance. Please select {minimumEventDate:dd-MM-yyyy} or later."
                });
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

        [HttpGet("payment-status")]
        public IActionResult GetPaymentStatus([FromQuery] int orderId)
        {
            if (orderId <= 0)
                return BadRequest(new { success = false, message = "Invalid order id." });

            try
            {
                var status = _orders.GetOrderPaymentStatus(orderId);
                if (status == null)
                    return NotFound(new { success = false, message = "Order not found." });

                return Ok(new
                {
                    success = true,
                    orderId = status.OrderId,
                    totalAmount = status.TotalAmount,
                    paidAmount = status.PaidAmount,
                    paymentStatus = status.PaymentStatus,
                    isPaid = status.IsPaid
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("create-payment-link")]
        public async Task<IActionResult> CreatePaymentLink([FromBody] CreatePaymentLinkRequest request)
        {
            if (request == null || request.OrderId <= 0 || request.Amount <= 0)
                return BadRequest(new { success = false, message = "Invalid payment request." });

            var keyId = _configuration["PaymentGateway:Razorpay:KeyId"];
            var keySecret = _configuration["PaymentGateway:Razorpay:KeySecret"];

            if (string.IsNullOrWhiteSpace(keyId) || string.IsNullOrWhiteSpace(keySecret))
                return BadRequest(new { success = false, message = "Razorpay is not configured." });

            try
            {
                var amountInPaise = (int)Math.Round(request.Amount * 100m, MidpointRounding.AwayFromZero);
                var payload = new
                {
                    amount = amountInPaise,
                    currency = "INR",
                    accept_partial = false,
                    description = "Order " + request.OrderId,
                    reference_id = "ORDER-" + request.OrderId,
                    customer = new
                    {
                        name = request.CustomerName,
                        contact = request.MobileNo,
                        email = request.EmailId
                    },
                    notify = new { sms = true, email = true },
                    reminder_enable = true,
                    notes = new { orderId = request.OrderId.ToString() }
                };

                var client = _httpClientFactory.CreateClient();
                var authToken = Convert.ToBase64String(Encoding.UTF8.GetBytes(keyId + ":" + keySecret));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authToken);

                using var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                using var response = await client.PostAsync("https://api.razorpay.com/v1/payment_links", content);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new
                    {
                        success = false,
                        message = "Unable to create payment link.",
                        detail = body
                    });
                }

                using var json = JsonDocument.Parse(body);
                var root = json.RootElement;
                var paymentUrl = root.TryGetProperty("short_url", out var shortUrl) ? shortUrl.GetString() : string.Empty;
                var paymentLinkId = root.TryGetProperty("id", out var idElement) ? idElement.GetString() : string.Empty;

                return Ok(new
                {
                    success = true,
                    paymentUrl,
                    paymentLinkId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Unable to create payment link.", detail = ex.Message });
            }
        }

       
    }
}
