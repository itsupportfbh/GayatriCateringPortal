namespace GayatriCateringPortal.Models;

public class OrderListItem
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string EmailId { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public string EventName { get; set; } = string.Empty;
    public string LocationName { get; set; } = string.Empty;
    public DateTime? EventDate { get; set; }
    public DateTime? CreatedDate { get; set; }
    public string MealPeriodName { get; set; } = string.Empty;
    public int Pax { get; set; }
    public int OrderStatus { get; set; }
    public string OrderStatusName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
}
