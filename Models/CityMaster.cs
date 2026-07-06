using System;

namespace GayatriCateringPortal.Models
{
    public class CityMaster
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public short? StateId { get; set; }
        public byte? CountryId { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Timezone { get; set; }
    }
}
