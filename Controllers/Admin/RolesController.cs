using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Roles")]
    public class RolesController : Controller
    {
        private readonly IRolesRepository _rolesRepository;

        public RolesController(IRolesRepository rolesRepository)
        {
            _rolesRepository = rolesRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            //var items = _rolesRepository.GetAll();
            //ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "roles";
            ViewData["Title"] = "Roles";
            return View("~/Views/Admin/Roles.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _rolesRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _rolesRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] RoleMaster item)
        {
            if (item == null) return BadRequest();
            int newId = _rolesRepository.Create(item);
            return Ok(new { success = newId > 0, id = newId });
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] RoleMaster item)
        {
            if (item == null) return BadRequest();
            bool updated = _rolesRepository.Update(item);
            return Ok(new { success = updated });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _rolesRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive")]
        public IActionResult ActiveInActive([FromQuery] int id, [FromQuery] bool status)
        {
            bool result = _rolesRepository.ActiveInActive(id, status);
            return Ok(new { success = result });
        }
    }
}
