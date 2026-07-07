using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Menus")]
    public class MenusController : Controller
    {
        private readonly IMenusRepository _menusRepository;

        public MenusController(IMenusRepository menusRepository)
        {
            _menusRepository = menusRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _menusRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "menus";
            ViewData["Title"] = "Menus";
            return View("~/Views/Admin/Menus.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _menusRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _menusRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Menu item)
        {
            if (item == null) return BadRequest();
            bool result = _menusRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _menusRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _menusRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
