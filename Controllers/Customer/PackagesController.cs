using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Packages")]
    public class PackagesController : Controller
    {
        private readonly IPackagesRepository _packages;

        public PackagesController(IPackagesRepository packages)
        {
            _packages = packages;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var list = _packages.GetAll();
            ViewData["Packages"] = list;
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Packages";
            return View("~/Views/Customer/Packages.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _packages.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _packages.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Packages item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (!string.IsNullOrWhiteSpace(item.Id)) int.TryParse(item.Id, out idValue);

            if (idValue == 0)
            {
                int newId = _packages.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _packages.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _packages.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _packages.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
