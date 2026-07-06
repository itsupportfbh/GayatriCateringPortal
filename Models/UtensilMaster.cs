using System;

namespace GayatriCateringPortal.Models
{
    public class UtensilMaster
    {
        public int UtensilID { get; set; }
        public string UtensilName { get; set; } = null!;
        public string UnitType { get; set; } = null!;
        public decimal Price { get; set; }
        public decimal DepositAmount { get; set; }
        public bool IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
