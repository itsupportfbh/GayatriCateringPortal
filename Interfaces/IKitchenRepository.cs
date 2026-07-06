using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IKitchenRepository
{
    List<FoodMenu> GetAll();
    FoodMenu? GetById(int id);
    bool Save(FoodMenu item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
