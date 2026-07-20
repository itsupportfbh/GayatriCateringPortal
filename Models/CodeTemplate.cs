using System;

namespace GayatriCateringPortal.Models
{
    public class CodeTemplate
    {
        public string Id { get; set; } = null!;
        public string? EntityNo { get; set; }
        public string? Name { get; set; }
        public string? StartValue { get; set; }
        public string? Prefix { get; set; }
        public string? CurrentValue { get; set; }
        public string? Suffix { get; set; }
        public string? OrgId { get; set; }
        public string? IsMaster { get; set; }
        public string? IsDeleted { get; set; }
        public string? IsActive { get; set; }
        public string CreatedBy { get; set; } = null!;
        public string CreatedDate { get; set; } = null!;
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? NoOfDigit { get; set; }
        public string? IsDateMonthYearWise { get; set; }
    }
}
