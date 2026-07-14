using System;

namespace GayatriCateringPortal.Models
{
    public class UtensilMaster
    {
        public int Id { get; set; }
        public string UtensilName { get; set; } = null!;
        public string UnitType { get; set; } = null!;
        public decimal Price { get; set; }
        public decimal DepositAmount { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public int UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}
