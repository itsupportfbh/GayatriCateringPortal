using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Freebies")]
    public class FreebiesController : Controller
    {
        private readonly IFreebiesRepository _freebiesRepository;

        public FreebiesController(IFreebiesRepository freebiesRepository)
        {
            _freebiesRepository = freebiesRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _freebiesRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "freebies";
            ViewData["Title"] = "Popular & Freebies";
            return View("~/Views/Admin/Freebies.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _freebiesRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _freebiesRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] PopularFreebieMaster item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (item.Id != 0) idValue = item.Id;

            if (idValue == 0)
            {
                int newId = _freebiesRepository.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _freebiesRepository.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _freebiesRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _freebiesRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
