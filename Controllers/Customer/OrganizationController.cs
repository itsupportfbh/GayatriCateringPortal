using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Customer;

[Route("Customer/Organization")]
public class OrganizationController : Controller
{
    private readonly ISettingsRepository _organizationRepository;

    public OrganizationController(ISettingsRepository organizationRepository)
    {
        _organizationRepository = organizationRepository;
    }

    [HttpGet("gst")]
    public IActionResult GetGstRate()
    {
        var organizations = _organizationRepository.GetAll();
        var organization = organizations.FirstOrDefault(item => item.IsActive && !item.IsDeleted)
            ?? organizations.FirstOrDefault();

        if (organization == null)
        {
            return NotFound(new { message = "Organization GST rate is not configured." });
        }

        return Ok(new { gstRate = organization.GSTRate });
    }
}
