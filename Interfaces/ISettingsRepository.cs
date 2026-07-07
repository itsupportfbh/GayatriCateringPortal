namespace GayatriCateringPortal.Interfaces;

public interface ISettingsRepository
{
    object GetSettings();
    //bool Save(object settings);
    int Create(object settings);
    bool Update(object settings);
}
