using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Kitchen")]
    public class KitchenController : Controller
    {
        private readonly IKitchenRepository _kitchenRepository;

        public KitchenController(IKitchenRepository kitchenRepository)
        {
            _kitchenRepository = kitchenRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _kitchenRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "kitchen";
            ViewData["Title"] = "Kitchen";
            return View("~/Views/Admin/Kitchen.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _kitchenRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _kitchenRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] FoodMenu item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (!string.IsNullOrWhiteSpace(item.Id)) int.TryParse(item.Id, out idValue);

            if (idValue == 0)
            {
                int newId = _kitchenRepository.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _kitchenRepository.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _kitchenRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _kitchenRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
