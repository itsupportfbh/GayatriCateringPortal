using System;

namespace GayatriCateringPortal.Models
{
    public class PopularFreebieMaster
    {
        public string Id { get; set; } = null!;
        public string ConfigType { get; set; } = null!;
        public string ConfigName { get; set; } = null!;
        public string? PackageId { get; set; }
        public string? MinPax { get; set; }
        public string? MaxPax { get; set; }
        public string? MinOrderAmount { get; set; }
        public string? FreeQty { get; set; }
        public string? LocationId { get; set; }
        public string DisplayOrder { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string? ValidFrom { get; set; }
        public string? ValidTo { get; set; }
        public string? Remarks { get; set; }
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
