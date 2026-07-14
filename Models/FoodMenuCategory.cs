using System;

namespace GayatriCateringPortal.Models
{
    public class FoodMenuCategory
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int MaxChoice { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public int UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
