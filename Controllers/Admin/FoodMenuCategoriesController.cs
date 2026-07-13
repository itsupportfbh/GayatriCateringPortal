using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Admin
{
    [Route("Admin/FoodMenuCategories")]
    public class FoodMenuCategoriesController : Controller
    {
        private readonly IFoodMenuCategoryRepository _categoryRepository;

        public FoodMenuCategoriesController(IFoodMenuCategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet("")]
        [HttpGet("/Admin/FoodCategory")]
        public IActionResult Index()
        {
            ViewData["Mode"] = "admin";
            ViewData["Page"] = "foodCategory";
            ViewData["Title"] = "Food Categories";
            return View("~/Views/Admin/FoodCategory.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _categoryRepository.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult GetById(string id)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();
            var item = _categoryRepository.GetById(id);
            return Ok(item);
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] FoodMenuCategory item)
        {
            if (item == null) return BadRequest();

            int newId = _categoryRepository.Create(item);
            if (newId == -1)
            {
                return Ok(new { success = false, message = "Food category with this code already exists" });
            }
            if (newId > 0)
            {
                return Ok(new { success = true, id = newId });
            }

            return Ok(new { success = false, message = "Unable to create food category" });
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] FoodMenuCategory item)
        {
            if (item == null) return BadRequest();

            int result = _categoryRepository.Update(item);
            if (result == -1)
            {
                return Ok(new { success = false, message = "Food category with this code already exists" });
            }
            if (result > 0)
            {
                return Ok(new { success = true });
            }

            return Ok(new { success = false, message = "Unable to update food category" });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(string id)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();

            bool result = _categoryRepository.Delete(id);
            return Ok(new { success = result });
        }

        [HttpPost("activeinactive")]
        public IActionResult ActiveInActive([FromQuery] string id, [FromQuery] bool status)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();

            bool result = _categoryRepository.ActiveInActive(id, status);
            return Ok(new { success = result });
        }
    }
}
