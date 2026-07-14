using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces
{
    public interface IFoodMenuCategoryRepository
    {
        List<FoodMenuCategory> GetAll();
        FoodMenuCategory? GetById(string id);
        int Create(FoodMenuCategory item);
        bool Update(FoodMenuCategory item);
        bool Delete(string id);
        bool ActiveInActive(string id, bool status);
    }
}
