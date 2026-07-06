using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
using GayatriCateringPortal.Interfaces;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Customers")]
    public class CustomersController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            var customers = _customerRepository.GetAll();
            ViewData["Customers"] = customers;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "customers";
            ViewData["Title"] = "Customers";
            return View("~/Views/Admin/Customers.cshtml");
        }
    }
}
