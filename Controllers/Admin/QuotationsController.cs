using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Quotations")]
    public class QuotationsController : Controller
    {
        private readonly IQuotationsRepository _quotationsRepository;

        public QuotationsController(IQuotationsRepository quotationsRepository)
        {
            _quotationsRepository = quotationsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _quotationsRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "quotations";
            ViewData["Title"] = "Quotations";
            return View("~/Views/Admin/Quotations.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _quotationsRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _quotationsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] object item)
        {
            if (item == null) return BadRequest();
            bool result = _quotationsRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _quotationsRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _quotationsRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
