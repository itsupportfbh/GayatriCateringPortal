using System;

namespace GayatriCateringPortal.Models
{
    public class UtensilMaster
    {
        public string Id { get; set; } = null!;
        public string UtensilName { get; set; } = null!;
        public string UnitType { get; set; } = null!;
        public string Price { get; set; } = null!;
        public string DepositAmount { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? IsActive { get; set; }
    }
}
