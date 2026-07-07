using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Menu")]
    public class MenuController : Controller
    {
        private readonly IMenusRepository _menusRepository;

        public MenuController(IMenusRepository menusRepository)
        {
            _menusRepository = menusRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _menusRepository.GetAll();
            ViewData["Menus"] = items;
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "menu";
            ViewData["Title"] = "Full Indian Menu";
            return View("~/Views/Customer/Menu.cshtml");
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
            if (item.Id == 0)
            {
                int newId = _menusRepository.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _menusRepository.Update(item);
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
