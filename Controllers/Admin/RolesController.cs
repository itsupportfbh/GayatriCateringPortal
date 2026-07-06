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
            bool result = _rolesRepository.Save(item);
            return Ok(new { success = result });
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
