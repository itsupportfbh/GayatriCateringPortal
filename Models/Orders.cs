using System;

namespace GayatriCateringPortal.Models
{
    public class Orders
    {
        public string Id { get; set; } = null!;
        public string? OrderNumber { get; set; }
        public string CustomerId { get; set; } = null!;
        public string? PackageId { get; set; }
        public string? MealPeriodId { get; set; }
        public string? LocationId { get; set; }
        public string? EventStartDateTime { get; set; }
        public string? EventEndDateTime { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Notes { get; set; }
        public string Pax { get; set; } = null!;
        public string? PackageBaseAmount { get; set; }
        public string? AdditionalMenuAmount { get; set; }
        public string? AddOnsAmount { get; set; }
        public string? UtensilsAmount { get; set; }
        public string SubTotal { get; set; } = null!;
        public string Discount { get; set; } = null!;
        public string DeliveryFee { get; set; } = null!;
        public string TaxAmount { get; set; } = null!;
        public string TotalAmount { get; set; } = null!;
        public string? TaxPercentage { get; set; }
        public string PaidAmount { get; set; } = null!;
        public string OrderStatus { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
