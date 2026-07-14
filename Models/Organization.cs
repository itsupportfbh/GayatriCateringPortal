using System;

namespace GayatriCateringPortal.Models
{
    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string UEN { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;        
        public string Hotline { get; set; } = null!;
        public string Whatsapp { get; set; } = null!;
        public int DefaultDeposit { get; set; }
        public int QuotationValidity { get; set; }
        public int MinOrderPax { get; set; }
        public int GSTRate { get; set; }
        public int Servicecharge { get; set; }
        public string PortalMode { get; set; } = null!;
        public string GSTNO { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedDate { get; set; } = null!;
        public int CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
    }
}
