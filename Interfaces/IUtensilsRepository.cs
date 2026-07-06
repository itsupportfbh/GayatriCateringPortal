using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IUtensilsRepository
{
    List<UtensilMaster> GetAll();
    UtensilMaster? GetById(int id);
    bool Save(UtensilMaster item);
    bool Delete(int id);    bool ActiveInActive(int id);}
