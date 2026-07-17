using System;

namespace GayatriCateringPortal.Models
{
    public class OrderEventDetails
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public int OrderId { get; set; }

        public DateTime? EventDate { get; set; }
       

        public string? Address { get; set; }

        public string? Notes { get; set; }

        public int? MealPeriodId { get; set; }

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
