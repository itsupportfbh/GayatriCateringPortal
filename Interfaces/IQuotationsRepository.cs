using System.Collections.Generic;

namespace GayatriCateringPortal.Interfaces;

public interface IQuotationsRepository
{
    List<object> GetAll();
    object? GetById(int id);
    bool Save(object item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
