using System;

namespace GayatriCateringPortal.Models
{
    public class FoodMenu
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string CategoryId { get; set; } = null!;
        public string? Price { get; set; }
        public string? PreparationTime { get; set; }
        public int? FoodType { get; set; }
        public string? Servicecharge { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public int UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
}
