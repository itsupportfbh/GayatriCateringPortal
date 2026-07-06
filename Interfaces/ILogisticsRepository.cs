using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface ILogisticsRepository
{
    List<LogisticsDetails> GetAll();
    LogisticsDetails? GetById(int id);
    bool Save(LogisticsDetails item);
    bool Delete(int id);    bool ActiveInActive(int id);}
