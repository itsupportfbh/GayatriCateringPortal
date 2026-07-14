using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;
namespace GayatriCateringPortal.Controllers.Customer
{
    [Route("Customer/Packages")]
    public class PackagesController : Controller
    {
        private readonly IPackagesRepository _packages;
        private readonly IPackageItemsRepository _packageItems;
        private readonly IFoodMenuCategoryRepository _categories;

        public PackagesController(
            IPackagesRepository packages,
            IPackageItemsRepository packageItems,
            IFoodMenuCategoryRepository categories)
        {
            _packages = packages;
            _packageItems = packageItems;
            _categories = categories;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var list = _packages.GetAll();
            ViewData["Packages"] = list;
            ViewData["Mode"] = "customer";
            ViewData["Page"] = "packages";
            ViewData["Title"] = "Packages";
            return View("~/Views/Customer/Packages.cshtml");
        }

        [HttpGet("get")]
        public IActionResult GetAll()
        {
            var items = _packages.GetAll();
            return Ok(items);
        }

        [HttpGet("get/{id}")]
        public IActionResult Get(int id)
        {
            var item = _packages.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("get/{id:int}/categories")]
        public IActionResult GetCategories(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "A valid package ID is required." });

            try
            {
                var packageItems = _packageItems.GetByPackageId(id)
                    .Where(item => item.IsActive != false && item.IsDeleted != true)
                    .ToList();

                if (packageItems.Count == 0)
                    return Ok(Array.Empty<object>());

                var categoryIds = packageItems
                    .Select(item => item.CategoryId.ToString())
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                //var categoriesById = _categories.GetAll()
                //    .Where(category => categoryIds.Contains(category.Id)
                //        && IsEnabled(category.IsActive)
                //        && !IsEnabled(category.IsDeleted))
                //    .GroupBy(category => category.Id, StringComparer.OrdinalIgnoreCase)
                //    .ToDictionary(group => group.Key, group => group.First(), StringComparer.OrdinalIgnoreCase);

                //var result = packageItems
                //    .Where(item => categoriesById.ContainsKey(item.CategoryId.ToString()))
                //    .Select(item => new
                //    {
                //        categoryId = item.CategoryId,
                //        categoryName = categoriesById[item.CategoryId.ToString()].Name,
                //        requiredQuantity = Math.Max(categoriesById[item.CategoryId.ToString()].MaxChoice, 1)
                //    })
                //    .ToList();

                return Ok("");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Unable to load categories for the selected package.",
                    detail = ex.Message
                });
            }
        }

        private static bool IsEnabled(string? value)
        {
            return value == "1" || bool.TryParse(value, out var parsed) && parsed;
        }


        [HttpPost("delete/{id}")]
        public IActionResult Delete(int id)
        {
            bool result = _packages.Delete(id);
            return Ok(new { success = result });
        }

      
    }
}
