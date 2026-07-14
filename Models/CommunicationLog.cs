using System;

namespace GayatriCateringPortal.Models
{
    public class CommunicationLog
    {
        public int Id { get; set; }
        public string? Channel { get; set; }
        public string? ToAddress { get; set; }
        public string? Message { get; set; }
        public string? IsActive { get; set; }
        public string? IsDeleted { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
