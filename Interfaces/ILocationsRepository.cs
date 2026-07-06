using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface ILocationsRepository
{
    List<LocationMaster> GetAll();
    LocationMaster? GetById(int id);
    bool Save(LocationMaster item);
    bool Delete(int id);    bool ActiveInActive(int id);}
