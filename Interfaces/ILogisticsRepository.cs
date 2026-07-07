using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface ILogisticsRepository
{
    List<LogisticsDetails> GetAll();
    LogisticsDetails? GetById(int id);
    LogisticsDetails? GetByOrderNumber(string orderNumber);
    bool Save(LogisticsDetails item);
    bool Delete(int id);    bool ActiveInActive(int id);}
