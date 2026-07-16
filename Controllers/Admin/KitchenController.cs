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

    }
}
