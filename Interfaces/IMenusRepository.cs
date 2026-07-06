using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IMenusRepository
{
    List<Menu> GetAll();
    Menu? GetById(int id);
    bool Save(Menu item);
    bool Delete(int id);    bool ActiveInActive(int id);}
