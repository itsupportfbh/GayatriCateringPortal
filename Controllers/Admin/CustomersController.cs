using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Customers")]
    public class CustomersController : Controller
    {
        private readonly ICustomerRepository _customers;

        public CustomersController(ICustomerRepository customers)
        {
            _customers = customers;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var list = _customers.GetAll();
            ViewData["Customers"] = list;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "customers";
            ViewData["Title"] = "Customers";
            return View("~/Views/Admin/Customers.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _customers.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _customers.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] CustomerMaster item)
        {
            if (item == null) return BadRequest();
            if (item.Id == 0)
            {
                int newId = _customers.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _customers.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _customers.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _customers.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
