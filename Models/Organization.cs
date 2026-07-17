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
        public string AccountHolderName { get; set; } = null!;
        public string IFSCCode { get; set; } = null!;
        public string AccNo { get; set; } = null!;
        public string UPIId { get; set; } = null!;
        public int DefaultDeposit { get; set; }
        public int QuotationValidity { get; set; }
        public int MinOrderPax { get; set; }
        public int GSTRate { get; set; }
        public int Servicecharge { get; set; }
        public string PortalMode { get; set; } = null!;
        public string GSTNO { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; } = null!;
        public int CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }

        // Keep backward compatibility with existing front-end keys.
        public string AccountNumber { get => AccountHolderName; set => AccountHolderName = value; }
        public string AccountNo { get => AccNo; set => AccNo = value; }
    }
}
