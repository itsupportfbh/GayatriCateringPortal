using System;

namespace GayatriCateringPortal.Models
{
    public class FoodMenu
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string CategoryId { get; set; } = null!;
        public string? Price { get; set; }
        public string? PreparationTime { get; set; }
        public string? FoodType { get; set; }
        public string? Servicecharge { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
