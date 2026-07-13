using System;

namespace GayatriCateringPortal.Models
{
    public class UserMaster
    {
        public int Id { get; set; }
        public string Code { get; set; } 
        public string Name { get; set; }
        public string? Remarks { get; set; }
        public bool IsAdmin { get; set; } 
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string? ContactNo { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Image { get; set; }
        public int? Gender { get; set; }
        public DateTime? DOB { get; set; }
        public int? Age { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public int? Country { get; set; }
        public int? State { get; set; }
        public int? City { get; set; }
        public int? PostalCode { get; set; }
    }
}
