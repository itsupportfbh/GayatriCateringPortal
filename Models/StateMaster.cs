using System;

namespace GayatriCateringPortal.Models
{
    public class StateMaster
    {
        public short? Id { get; set; }
        public string? Name { get; set; }
        public byte? CountryId { get; set; }
        public string? CountryCode { get; set; }
        public string? CountryName { get; set; }
        public string? Iso2 { get; set; }
        public string? Iso31662 { get; set; }
        public string? FipsCode { get; set; }
        public string? Type { get; set; }
        public int? Level { get; set; }
        public string? ParentId { get; set; }
        public string? Native { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Timezone { get; set; }
        public decimal? WikiDataId { get; set; }
        public int? Population { get; set; }
    }
}
