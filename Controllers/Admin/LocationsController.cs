using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Locations")]
    public class LocationsController : Controller
    {
        private readonly ILocationsRepository _locationsRepository;

        public LocationsController(ILocationsRepository locationsRepository)
        {
            _locationsRepository = locationsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _locationsRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "locations";
            ViewData["Title"] = "Locations";
            return View("~/Views/Admin/Locations.cshtml");
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _locationsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] LocationMaster item)
        {
            if (item == null) return BadRequest();
            bool result = _locationsRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _locationsRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _locationsRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
