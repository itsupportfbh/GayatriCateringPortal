using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IInvoicesRepository
{
    List<Orders> GetAll();
    Orders? GetById(int id);
    bool Save(Orders item);
    bool Delete(int id);    bool ActiveInActive(int id);}
