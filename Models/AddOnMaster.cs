using System;

namespace GayatriCateringPortal.Models
{
    public class AddOnMaster
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string AddOnName { get; set; } = null!;
        public string UnitType { get; set; } = null!;
        public string Rate { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
