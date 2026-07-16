using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IOrdersRepository
{
    List<Orders> GetAll();
    List<OrderListItem> GetOrderList(DateTime? fromDate = null, DateTime? toDate = null);
    int AdvanceOrderStatus(int orderId, int userId, bool isAdmin);
    Orders? GetById(int id);
    int Create(Orders order);
    int CreateCompleteOrder(CreateOrderRequest request);
    int UpdateCompleteOrder(CreateOrderRequest request);
    bool Update(Orders order);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
