namespace GayatriCateringPortal.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }

    public class State
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int CountryId { get; set; }
    }

    public class City
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int StateId { get; set; }
    }
}