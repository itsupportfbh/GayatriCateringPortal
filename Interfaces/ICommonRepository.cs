using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces
{
    public interface ICommonRepository
    {
        List<MenuGroup> GetMenuGroups();
        List<Country> GetCountry();
        List<State> GetStateByCountryId(int countryId);
        List<City> GetCityByStateId(int stateId);
    }
}
