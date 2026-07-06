using System;

namespace GayatriCateringPortal.Models
{
    public class OrderPackageDetails
    {
        public string Id { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string? CategoryId { get; set; }
        public string? MenuId { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
