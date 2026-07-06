using System;

namespace GayatriCateringPortal.Models
{
    public class PopularFreebieMaster
    {
        public int ConfigID { get; set; }
        public string ConfigType { get; set; } = null!;
        public string ConfigName { get; set; } = null!;
        public int? PackageID { get; set; }
        public int? MinPax { get; set; }
        public int? MaxPax { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? FreeQty { get; set; }
        public int? LocationID { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string? Remarks { get; set; }
        public bool IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
