using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/MealPeriods")]
    public class MealPeriodsController : Controller
    {
        private readonly IMealPeriodsRepository _mealPeriods;

        public MealPeriodsController(IMealPeriodsRepository mealPeriodsRepository)
        {
            _mealPeriods = mealPeriodsRepository;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "mealperiods";
            ViewData["Title"] = "Meal Periods";

            return View("~/Views/Admin/MealPeriods.cshtml");
        }



        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var items = _mealPeriods.GetAll();

            return Ok(items);
        }



        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _mealPeriods.GetById(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }


       

        [HttpPost("create")]
        public IActionResult Create([FromBody] MealPeriodMaster item)
        {
            if (item == null)
                return BadRequest(new { success = false, message = "Invalid Meal Period details." });

            
                int newId = _mealPeriods.Create(item);
                return Ok(new
                {
                    success = newId > 0,
                    id = newId > 0 ? newId : 0,
                    message = newId switch
                    {
                        > 0 => "Meal Period created successfully.",
                        -1 => "Meal Period Name already exists.",
                        -2 => "Display Order already exists.",
                        _ => "Meal Period was not saved."
                    }
                });
            
        }


       

        [HttpPost("update")]
        public IActionResult Update([FromBody] MealPeriodMaster item)
        {
            if (item == null)
                return BadRequest(new { success = false, message = "Invalid Meal Period details." });

            try
            {
                bool updated = _mealPeriods.Update(item);
                return Ok(new
                {
                    success = updated,
                    message = updated
                        ? "Meal Period updated successfully."
                        : "Meal Period was not updated."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }



        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _mealPeriods.Delete(id);

            return Ok(new
            {
                success = result
            });
        }


        

        [HttpPost("activeinactive")]
        public IActionResult ActiveInActive(int id, bool status)
        {
            bool result = _mealPeriods.ActiveInActive(id, status);

            return Ok(new
            {
                success = result
            });
        }
    }
}
