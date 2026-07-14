using System;

namespace GayatriCateringPortal.Models
{
    public class Orders
    {
            public int Id { get; set; }

            public string? OrderNumber { get; set; }

            public int CustomerId { get; set; }

            public int? PackageId { get; set; }

            public int? MealPeriodId { get; set; }

            public int? LocationId { get; set; }

            public DateTime? EventStartDateTime { get; set; }

            public DateTime? EventEndDateTime { get; set; }

            public string? DeliveryAddress { get; set; }

            public string? Notes { get; set; }

            public int Pax { get; set; }

            public decimal? PackageBaseAmount { get; set; }

            public decimal? AdditionalMenuAmount { get; set; }

            public decimal? AddOnsAmount { get; set; }

            public decimal? UtensilsAmount { get; set; }

            public decimal SubTotal { get; set; }

            public decimal Discount { get; set; }

            public decimal DeliveryFee { get; set; }

            public decimal TaxAmount { get; set; }

            public decimal TotalAmount { get; set; }

            public decimal? TaxPercentage { get; set; }

            public decimal PaidAmount { get; set; }

            public int OrderStatus { get; set; }

            public DateTime CreatedDate { get; set; }

            public int? CreatedBy { get; set; }

            public DateTime? UpdatedDate { get; set; }

            public int? UpdatedBy { get; set; }
        }
    }