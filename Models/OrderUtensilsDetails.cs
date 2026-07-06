using System;

namespace GayatriCateringPortal.Models
{
    public class OrderUtensilsDetails
    {
        public string Id { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string UtensilsId { get; set; } = null!;
        public string Qty { get; set; } = null!;
        public string UnitPrice { get; set; } = null!;
        public string TotalAmount { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
