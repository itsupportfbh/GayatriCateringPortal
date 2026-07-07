using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/MealPeriods")]
    public class MealPeriodsController : Controller
    {
        private readonly IMealPeriodsRepository _mealPeriodsRepository;

        public MealPeriodsController(IMealPeriodsRepository mealPeriodsRepository)
        {
            _mealPeriodsRepository = mealPeriodsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var items = _mealPeriodsRepository.GetAll();
            ViewData["Items"] = items;
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "mealperiods";
            ViewData["Title"] = "Meal Periods";
            return View("~/Views/Admin/MealPeriods.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _mealPeriodsRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _mealPeriodsRepository.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("save")]
           public IActionResult Save([FromBody] MealPeriodMaster item)
           {
               if (item == null) return BadRequest();
               var idValue = 0;
               if (item.Id != 0) idValue = item.Id;

               if (idValue == 0)
               {
                   int newId = _mealPeriodsRepository.Create(item);
                   return Ok(new { success = newId > 0, id = newId });
               }

               bool result = _mealPeriodsRepository.Update(item);
               return Ok(new { success = result });
           }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _mealPeriodsRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive/{id}")]
        public IActionResult ActiveInActive(int id)
        {
            bool result = _mealPeriodsRepository.ActiveInActive(id);
            return Ok(new { success = result });
        }
    }
}
