using System;

namespace GayatriCateringPortal.Models
{
    public class AddOnMaster
    {
        public int Id { get; set; }
        public string AddOnCode { get; set; } = null!;
        public string AddOnName { get; set; } = null!;
        public string UnitType { get; set; } = null!;
        public decimal Rate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
