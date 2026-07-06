using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IFreebiesRepository
{
    List<PopularFreebieMaster> GetAll();
    PopularFreebieMaster? GetById(int id);
    bool Save(PopularFreebieMaster item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
