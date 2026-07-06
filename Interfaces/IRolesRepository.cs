using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IRolesRepository
{
    List<RoleMaster> GetAll();
    RoleMaster? GetById(int id);
    bool Save(RoleMaster item);
    bool Delete(int id);    bool ActiveInActive(int id);}
