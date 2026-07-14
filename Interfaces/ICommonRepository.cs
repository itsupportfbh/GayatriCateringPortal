using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces
{
    public interface ICommonRepository
    {
        List<MenuGroup> GetMenuGroups();
        List<EntityMaster> GetEntityMaster();
        List<RolePermissionItem> GetRolePermissionsByRoleId(int roleId);
        int CreateRolePermission(List<CreateRolePermissionRequest> requests);
        List<Country> GetCountry();
        List<State> GetStateByCountryId(int countryId);
        List<City> GetCityByStateId(int stateId);
    }
}
