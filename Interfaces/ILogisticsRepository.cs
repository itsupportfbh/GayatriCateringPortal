using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface ILogisticsRepository
{
    List<OrderListItem> GetAll(DateTime? fromDate = null, DateTime? toDate = null);
    List<LogisticsDetails> GetDelivered();
    LogisticsDetails? GetById(int id);
    LogisticsDetails? GetByOrderNumber(string orderNumber);
    int Create(LogisticsDetails item);
    int Update(LogisticsDetails item);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
