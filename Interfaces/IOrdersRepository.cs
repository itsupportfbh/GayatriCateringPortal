using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface IOrdersRepository
{
    List<OrderListItem> GetOrderList(DateTime? fromDate = null, DateTime? toDate = null);
    int UpdateOrderStatus(int OrderId, int Status);
    int UpdateOrderPaymentStatus(int OrderId, int Status);
    OrderPaymentStatus? GetOrderPaymentStatus(int orderId);
    bool UpdatePaymentFromWebhook(int orderId, decimal paidAmount);
    int Create(Orders order);
    int CreateCompleteOrder(CreateOrderRequest request);
    int UpdateCompleteOrder(CreateOrderRequest request);
    bool Update(Orders order);
}
