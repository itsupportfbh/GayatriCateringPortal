using System;

namespace GayatriCateringPortal.Models
{
    public class EntityMaster
    {
        public string Id { get; set; } = null!;
        public string? Name { get; set; }
        public string? EntityNo { get; set; }
        public string? IsMaster { get; set; }
        public string? IsDeleted { get; set; }
        public string? IsActive { get; set; }
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
