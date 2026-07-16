using GayatriCateringPortal.Interfaces.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Customer;

[AllowAnonymous]
[Route("Customer/MyOrders")]
public class MyOrdersController : Controller
{
    private readonly IMYOrderRepository _myOrders;

    public MyOrdersController(IMYOrderRepository myOrders)
    {
        _myOrders = myOrders;
    }

    [HttpGet("")]
    public IActionResult Index()
    {
        ViewData["Mode"] = "customer";
        ViewData["Page"] = "myorders";
        ViewData["Title"] = "My Orders";
        return View("~/Views/Customer/MyOrders.cshtml");
    }

    [HttpGet("get")]
    public IActionResult GetMyOrders([FromQuery] string phoneNo)
    {
        if (string.IsNullOrWhiteSpace(phoneNo))
            return BadRequest(new { message = "Please enter your phone number." });

        return Ok(_myOrders.GetMyOrders(phoneNo.Trim()));
    }
}
