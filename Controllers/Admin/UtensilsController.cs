using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Utensils")]
    public class UtensilsController : Controller
    {
        private readonly IUtensilsRepository _repo;

        public UtensilsController(IUtensilsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var list = _repo.GetAll();
            ViewData["Utensils"] = list;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "utensils";
            ViewData["Title"] = "Utensils";
            return View("~/Views/Admin/Utensils.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _repo.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _repo.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] UtensilMaster item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (item.Id != 0) idValue = item.Id;

            if (idValue == 0)
            {
                int newId = _repo.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _repo.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _repo.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _repo.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
