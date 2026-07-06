using System;

namespace GayatriCateringPortal.Models
{
    public class PackageItems
    {
        public string Id { get; set; } = null!;
        public string CategoryId { get; set; } = null!;
        public string Quantity { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? IsActive { get; set; }
        public string? IsDeleted { get; set; }
    }
}
