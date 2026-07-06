using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Customers")]
    public class CustomersController : Controller
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomersController(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

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

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var customer = _customerRepository.GetById(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] CustomerMaster customer)
        {
            if (customer == null) return BadRequest();
            bool result = _customerRepository.Save(customer);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _customerRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _customerRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
