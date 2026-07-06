using System;

namespace GayatriCateringPortal.Models
{
    public class MealPeriodMaster
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string MealPeriodName { get; set; } = null!;
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public string DisplayOrder { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? IsDeleted { get; set; }
    }
}
