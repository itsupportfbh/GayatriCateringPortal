using System;

namespace GayatriCateringPortal.Models
{
    public class CommunicationLog
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? Channel { get; set; }
        public string? ToEmail { get; set; }
        public string? Message { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
