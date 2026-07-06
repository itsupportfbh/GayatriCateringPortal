using System;

namespace GayatriCateringPortal.Models
{
    public class PackageItems
    {
        public int PackageItemID { get; set; }
        public int PackageID { get; set; }
        public int CategoryID { get; set; }
        public int Quantity { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
