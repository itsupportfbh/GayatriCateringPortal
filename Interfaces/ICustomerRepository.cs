using GayatriCateringPortal.Models;
using System.Collections.Generic;

namespace GayatriCateringPortal.Interfaces;

public interface ICustomerRepository
{
    List<CustomerMaster> GetAll();
    CustomerMaster? GetById(int id);
    bool Save(CustomerMaster customer);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
