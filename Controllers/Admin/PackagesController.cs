using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Packages")]
    public class PackagesController : Controller
    {
        private readonly IPackagesRepository _packagesRepository;

        public PackagesController(IPackagesRepository packagesRepository)
        {
            _packagesRepository = packagesRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _packagesRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Packages";
            return View("~/Views/Admin/Packages.cshtml");
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _packagesRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Packages item)
        {
            if (item == null) return BadRequest();
            bool result = _packagesRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _packagesRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _packagesRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
