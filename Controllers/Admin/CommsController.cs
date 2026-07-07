using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/Comms")]
    public class CommsController : Controller
    {
        private readonly ICommsRepository _commsRepository;

        public CommsController(ICommsRepository commsRepository)
        {
            _commsRepository = commsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _commsRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "comms";
            ViewData["Title"] = "Communications";
            return View("~/Views/Admin/Comms.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _commsRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _commsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] CommunicationLog item)
        {
            if (item == null) return BadRequest();
            bool result = _commsRepository.Save(item);
            return Ok(new { success = result });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _commsRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _commsRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
