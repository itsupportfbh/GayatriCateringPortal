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


        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _packages.Delete(id);
            return Ok(new { success = result });
        }

      
    }
}
