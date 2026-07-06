using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IOrdersRepository
{
    List<Orders> GetAll();
    Orders? GetById(int id);
    int CreateOrUpdate(Orders order);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
