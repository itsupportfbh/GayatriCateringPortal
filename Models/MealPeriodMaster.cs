using System;

namespace GayatriCateringPortal.Models
{
    public class MealPeriodMaster
    {
        public int Id { get; set; }
        public string MealPeriodCode { get; set; } = null!;
        public string MealPeriodName { get; set; } = null!;
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
