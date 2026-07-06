using System;

namespace GayatriCateringPortal.Models
{
    public class RoleMaster
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Remarks { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
