using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Finance")]
    public class FinanceController : Controller
    {
        private readonly IFinanceRepository _financeRepository;

        public FinanceController(IFinanceRepository financeRepository)
        {
            _financeRepository = financeRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _financeRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "finance";
            ViewData["Title"] = "Finance";
            return View("~/Views/Admin/Finance.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _financeRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _financeRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Orders item)
        {
            if (item == null) return BadRequest();
            var idValue = 0;
            if (item.Id != 0) idValue = item.Id;

            if (idValue == 0)
            {
                int newId = _financeRepository.Create(item);
                return Ok(new { success = newId > 0, id = newId });
            }

            bool result = _financeRepository.Update(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _financeRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _financeRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
