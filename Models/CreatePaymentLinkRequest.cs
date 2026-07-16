namespace GayatriCateringPortal.Models;

public class CreatePaymentLinkRequest
{
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string? CustomerName { get; set; }
    public string? MobileNo { get; set; }
    public string? EmailId { get; set; }
}
