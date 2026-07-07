using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IUtensilsRepository
{
    List<UtensilMaster> GetAll();
    UtensilMaster? GetById(int id);
    int Create(UtensilMaster item);
    bool Update(UtensilMaster item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
