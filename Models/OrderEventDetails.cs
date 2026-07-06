using System;

namespace GayatriCateringPortal.Models
{
    public class OrderEventDetails
    {
        public string Id { get; set; } = null!;
        public string CustomerId { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string? EventStartDate { get; set; }
        public string? EventEndDate { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? Notes { get; set; }
        public string? MealPeriodId { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
