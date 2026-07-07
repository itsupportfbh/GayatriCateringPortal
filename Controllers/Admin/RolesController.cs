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
            var items = _rolesRepository.GetAll();
            ViewData["Items"] = items;
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

        [HttpPost("save")]
        public IActionResult Save([FromBody] RoleMaster item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (!string.IsNullOrWhiteSpace(item.Id)) int.TryParse(item.Id, out idValue);

            if (idValue == 0)
            {
                int newId = _rolesRepository.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool updated = _rolesRepository.Update(item);
            return Ok(new { success = updated });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _rolesRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _rolesRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
