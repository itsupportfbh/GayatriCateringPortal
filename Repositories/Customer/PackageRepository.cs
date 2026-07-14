using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Interfaces.Customer;
using GayatriCateringPortal.Models;
using GayatriCateringPortal.Models.Customer;

namespace GayatriCateringPortal.Repositories.Customer
{
    public class PackageRepository : IPackageRepository
    {
        private readonly IPackagesRepository _packages;
        private readonly IPackageItemsRepository _packageItems;
        private readonly IFoodMenuCategoryRepository _categories;

        public PackageRepository(
            IPackagesRepository packages,
            IPackageItemsRepository packageItems,
            IFoodMenuCategoryRepository categories)
        {
            _packages = packages;
            _packageItems = packageItems;
            _categories = categories;
        }

        public List<Packages> GetAll() => _packages.GetAll();

        public Packages? GetById(int id) => _packages.GetById(id);

        public bool Delete(int id) => _packages.Delete(id);

        public List<PackageCategoryChoice> GetCategoriesByPackageId(int packageId)
        {
            if (packageId <= 0)
                return new List<PackageCategoryChoice>();

            var packageItems = _packageItems.GetByPackageId(packageId)
                .Where(item => item.IsActive != false && item.IsDeleted != true)
                .ToList();

            var categoryIds = packageItems
                .Select(item => item.CategoryId)
                .ToHashSet();

            var categoriesById = _categories.GetAll()
                .Where(category => categoryIds.Contains(category.Id)
                    && category.IsActive
                    && !category.IsDeleted)
                .GroupBy(category => category.Id)
                .ToDictionary(group => group.Key, group => group.First());

            return packageItems
                .Where(item => categoriesById.ContainsKey(item.CategoryId))
                .Select(item =>
                {
                    var category = categoriesById[item.CategoryId];
                    return new PackageCategoryChoice
                    {
                        CategoryId = item.CategoryId,
                        CategoryName = category.Name,
                        RequiredQuantity = Math.Max(category.MaxChoice, 1)
                    };
                })
                .ToList();
        }

    }
}
