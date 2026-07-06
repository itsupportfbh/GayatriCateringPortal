using System;

namespace GayatriCateringPortal.Models
{
    public class CountryMaster
    {
        public byte? Id { get; set; }
        public string? Name { get; set; }
        public string? Iso3 { get; set; }
        public string? Iso2 { get; set; }
        public short? NumericCode { get; set; }
        public short? Phonecode { get; set; }
        public string? Capital { get; set; }
        public string? Currency { get; set; }
        public string? CurrencyName { get; set; }
        public string? CurrencySymbol { get; set; }
        public string? Tld { get; set; }
        public string? Native { get; set; }
        public int? Population { get; set; }
        public int? Gdp { get; set; }
        public string? Region { get; set; }
        public byte? RegionId { get; set; }
        public string? Subregion { get; set; }
        public byte? SubregionId { get; set; }
        public string? Nationality { get; set; }
        public int? AreaSqKm { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Emoji { get; set; }
        public decimal? WikiDataId { get; set; }
    }
}
