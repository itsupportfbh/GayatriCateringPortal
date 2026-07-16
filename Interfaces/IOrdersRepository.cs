using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IOrdersRepository
{
    List<Orders> GetAll();
    List<OrderListItem> GetOrderList(DateTime? fromDate = null, DateTime? toDate = null);
    int UpdateOrderStatus(int orderId, int status);
    Orders? GetById(int id);
    int Create(Orders order);
    int CreateCompleteOrder(CreateOrderRequest request);
    int UpdateCompleteOrder(CreateOrderRequest request);
    bool Update(Orders order);
    bool Delete(int id);
    bool ActiveInActive(int id);
}
