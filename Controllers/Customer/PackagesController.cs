using GayatriCateringPortal.Interfaces.Customer;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Packages")]
    public class PackagesController : Controller
    {
        private readonly IPackageRepository _packages;

        public PackagesController(IPackageRepository packages) => _packages = packages;

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Packages"] = _packages.GetAll();
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Packages";
            return View("~/Views/Customer/Packages.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll() => Ok(_packages.GetAll());

        [HttpGet("get/{id:int}")]
        public IActionResult Get(int id)
        {
            var item = _packages.GetById(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpGet("get/{id:int}/categories")]
        public IActionResult GetCategories(int id)
        {
            if (id <= 0) return BadRequest(new { message = "A valid package ID is required." });
            try
            {
                return Ok(_packages.GetCategoriesByPackageId(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Unable to load categories for the selected package.", detail = ex.Message });
            }
        }

        [HttpPost("delete/{id:int}")]
        public IActionResult Delete(int id) => Ok(new { success = _packages.Delete(id) });
    }
}
