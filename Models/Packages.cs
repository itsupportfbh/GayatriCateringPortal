using System;

namespace GayatriCateringPortal.Models
{
    public class Packages
    {
        public string Id { get; set; } = null!;
        public string PackageName { get; set; } = null!;
        public string? PackageDescription { get; set; }
        public string? PackageType { get; set; }
        public string Price { get; set; } = null!;
        public string MinPersons { get; set; } = null!;
        public string? MaxPersons { get; set; }
        public string IsActive { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? IsDeleted { get; set; }
    }
}
