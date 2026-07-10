using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Locations")]
    public class LocationsController : Controller
    {
        private readonly ILocationsRepository _locations;

        public LocationsController(ILocationsRepository locations)
        {
            _locations = locations;
        }

        // ==========================================
        // PAGE
        // GET: /Admin/Locations
        // ==========================================

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "locations";
            ViewData["Title"] = "Locations";

            return View("~/Views/Admin/Locations.cshtml");
        }


        // ==========================================
        // GET ALL LOCATIONS
        // GET: /Admin/Locations/getAll
        // ==========================================

        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var items = _locations.GetAll();

            return Ok(items);
        }


        // ==========================================
        // GET LOCATION BY ID
        // GET: /Admin/Locations/get/1
        // ==========================================

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _locations.GetById(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }


        // ==========================================
        // CREATE LOCATION
        // POST: /Admin/Locations/create
        // ==========================================

        [HttpPost("create")]
        public IActionResult Create([FromBody] LocationMaster item)
        {
            if (item == null)
                return BadRequest();

            int newId = _locations.Create(item);

            return Ok(new
            {
                success = newId > 0,
                id = newId
            });
        }


        // ==========================================
        // UPDATE LOCATION
        // POST: /Admin/Locations/update
        // ==========================================

        [HttpPost("update")]
        public IActionResult Update([FromBody] LocationMaster item)
        {
            if (item == null)
                return BadRequest();

            bool updated = _locations.Update(item);

            return Ok(new
            {
                success = updated
            });
        }


        // ==========================================
        // DELETE LOCATION
        // POST: /Admin/Locations/delete/1
        // ==========================================

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _locations.Delete(id);

            return Ok(new
            {
                success = result
            });
        }


        // ==========================================
        // ACTIVE / INACTIVE LOCATION
        //
        // POST:
        // /Admin/Locations/activeinactive?id=1&status=false
        // ==========================================

        [HttpPost("activeinactive")]
        public IActionResult ActiveInActive(int id, bool status)
        {
            bool result = _locations.ActiveInActive(id, status);

            return Ok(new
            {
                success = result
            });
        }
    }
}