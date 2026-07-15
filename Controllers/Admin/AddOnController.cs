using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/AddOn")]
    public class AddOnController : Controller
    {
        private readonly IAddOnRepository _addOn;

        public AddOnController(IAddOnRepository addOn)
        {
            _addOn = addOn;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "locations";
            ViewData["Title"] = "Locations";

            return View("~/Views/Admin/AddOn.cshtml");
        }



        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var items = _addOn.GetAll();

            return Ok(items);
        }
    }
}