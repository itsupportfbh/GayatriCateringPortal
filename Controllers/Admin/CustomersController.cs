using Microsoft.AspNetCore.Mvc;
using GayatriCateringPortal.Interfaces;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Customers")]
    public class CustomersController : Controller
    {



        private readonly ICustomerRepository _customerRepository;
        public CustomersController( ICustomerRepository customerRepository)
        {
            _customerRepository= customerRepository;
        }
        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "customers";
            ViewData["Title"] = "Customers";
            return View("~/Views/Admin/Customers.cshtml");
        }

        [HttpGet]
        public IActionResult GetCustomers()
        {
            return View(_customerRepository.GetAll());
        }

    }
}
