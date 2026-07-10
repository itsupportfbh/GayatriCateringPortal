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

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _categoryRepository.GetAll();
            return Ok(items);
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] FoodMenuCategory item)
        {
            if (item == null) return BadRequest();
            return Ok(new { success = true });
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] FoodMenuCategory item)
        {
            if (item == null) return BadRequest();
            return Ok(new { success = true });
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete(string id)
        {
            return Ok(new { success = true });
        }

        [HttpPost("activeinactive")]
        public IActionResult ActiveInActive([FromQuery] string id, [FromQuery] bool status)
        {
            return Ok(new { success = true });
        }
    }
}
