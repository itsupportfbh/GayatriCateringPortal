using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces
{
    public interface IAddOnRepository
    {
        List<AddOnMaster> GetAll();
    }
}
