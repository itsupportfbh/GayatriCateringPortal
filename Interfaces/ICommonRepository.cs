using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces
{
    public interface ICommonRepository
    {
        List<MenuGroup> GetMenuGroups();
    }
}
