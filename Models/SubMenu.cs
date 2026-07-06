using System;

namespace GayatriCateringPortal.Models
{
    public class SubMenu
    {
        public int Id { get; set; }
        public int? MenuId { get; set; }
        public string? Name { get; set; }
        public int? EntityNo { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? DisplayOrder { get; set; }
        public string? Route { get; set; }
        public string? Remarks { get; set; }
        public int? Menuscope { get; set; }
        public string? MenuIcon { get; set; }
    }
}
