using System;

namespace GayatriCateringPortal.Models
{
    public class UserRoleMapping
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string RoleId { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
