using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IUserRoleMappingRepository
{
    List<UserRoleMapping> GetByUserId(int userId);
    bool CreateUserRoleMappings(List<UserRoleMapping> items);
    bool DeleteUserRoleMappingById(int id);
}
