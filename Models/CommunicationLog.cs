using System;

namespace GayatriCateringPortal.Models
{
    public class CommunicationLog
    {
        public string Id { get; set; } = null!;
        public string? Code { get; set; }
        public string? Channel { get; set; }
        public string? ToEmail { get; set; }
        public string? Message { get; set; }
        public string? IsActive { get; set; }
        public string? IsDeleted { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
