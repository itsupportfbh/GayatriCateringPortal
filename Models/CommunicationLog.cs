using System;

namespace GayatriCateringPortal.Models
{
    public class CommunicationLog
    {
        public int Id { get; set; }
        public string? Channel { get; set; }
        public string? ToAddress { get; set; }
        public string? Message { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string? CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public string? UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
    }
}
