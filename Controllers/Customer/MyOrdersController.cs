using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/MyOrders")]
    public class MyOrdersController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "myorders";
            ViewData["Title"] = "My Orders";
            return View("~/Views/Customer/MyOrders.cshtml");
        }
    }
}
