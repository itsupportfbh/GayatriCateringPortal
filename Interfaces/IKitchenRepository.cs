using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IKitchenRepository
{
    List<FoodMenu> GetAll();
  
}
