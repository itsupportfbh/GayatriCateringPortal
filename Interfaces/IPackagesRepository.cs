using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IPackagesRepository
{
    List<Packages> GetAll();
    Packages? GetById(int id);
    bool Save(Packages item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
