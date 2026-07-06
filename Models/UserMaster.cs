using System;

namespace GayatriCateringPortal.Models
{
    public class UserMaster
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Remarks { get; set; }
        public string IsAdmin { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? ContactNo { get; set; }
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? Image { get; set; }
        public string? Gender { get; set; }
        public string? DOB { get; set; }
        public string? Age { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? PinNo { get; set; }
    }
}
