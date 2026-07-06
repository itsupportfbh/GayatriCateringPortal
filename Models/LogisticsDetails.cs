using System;

namespace GayatriCateringPortal.Models
{
    public class LogisticsDetails
    {
        public string Id { get; set; } = null!;
        public string? OrderDate { get; set; }
        public string? OrderNumber { get; set; }
        public string? Location { get; set; }
        public string? DriverName { get; set; }
        public string? Status { get; set; }
        public string? IsActive { get; set; }
        public string? IsDeleted { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
