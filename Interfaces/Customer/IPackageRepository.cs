using GayatriCateringPortal.Models;
using GayatriCateringPortal.Models.Customer;

namespace GayatriCateringPortal.Interfaces.Customer
{
    public interface IPackageRepository
    {
        List<Packages> GetAll();
        Packages? GetById(int id);
        List<PackageCategoryChoice> GetCategoriesByPackageId(int packageId);
        bool Delete(int id);
    }
}
