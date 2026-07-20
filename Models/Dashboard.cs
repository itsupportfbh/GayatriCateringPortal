namespace GayatriCateringPortal.Models
{
    public class Dashboard
    {
        public DashboardSummary Summary { get; set; } = new DashboardSummary();
        public List<DashboardDetails> RecentOrders { get; set; } = new List<DashboardDetails>();
    }
}
