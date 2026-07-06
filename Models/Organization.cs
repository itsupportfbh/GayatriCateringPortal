using System;

namespace GayatriCateringPortal.Models
{
    public class Organization
    {
        public string Id { get; set; } = null!;
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string GSTNO { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Website { get; set; } = null!;
        public string ContactPerson { get; set; } = null!;
        public string ContactPhone { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public string AddressLine1 { get; set; } = null!;
        public string AdressLine2 { get; set; } = null!;
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string IsActive { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
