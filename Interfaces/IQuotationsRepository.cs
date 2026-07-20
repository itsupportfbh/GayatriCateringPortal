using GayatriCateringPortal.Models;
using System.Collections.Generic;

namespace GayatriCateringPortal.Interfaces;

public interface IQuotationsRepository
{
    List<OrderListItem> GetAll();
    object? GetById(int id);
    int Create(object item);
    bool Update(object item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
