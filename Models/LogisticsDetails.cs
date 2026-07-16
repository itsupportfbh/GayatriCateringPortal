using System;

namespace GayatriCateringPortal.Models
{
    public class LogisticsDetails
    {
        public int Id { get; set; }
        public string? OrderDate { get; set; }
        public string? OrderNumber { get; set; }
        public string? Location { get; set; }
        public string? DriverName { get; set; }
        public string? Status { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
    }
}
