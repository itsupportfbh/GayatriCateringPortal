namespace GayatriCateringPortal.Interfaces;

public interface ISettingsRepository
{
    object GetSettings();
    bool Save(object settings);
}
