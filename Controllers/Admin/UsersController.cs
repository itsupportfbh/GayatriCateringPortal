using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.AspNetCore.Mvc;

namespace GayatriCateringPortal.Controllers.Admin;

[Area("Admin")]
[Route("Admin/[controller]")]
public class UsersController : Controller
{
    private readonly IUsersRepository _usersRepository;

    public UsersController(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public IActionResult Index()
    {
        ViewData["Mode"] = "admin";
        ViewData["Page"] = "users";
        ViewData["Title"] = "Users";
        return View("~/Views/Admin/Users.cshtml");
    }

    [HttpGet("get")]
    public IActionResult Get()
    {
        var users = _usersRepository.GetAll();
        return Ok(users);
    }

    [HttpGet("get/{id}")]
    public IActionResult Get(int id)
    {
        var user = _usersRepository.GetById(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] UserMaster item)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values
                .SelectMany(x => x.Errors)
                .Select(x => x.ErrorMessage));
        }

        if (item == null) return BadRequest();
        int newId = _usersRepository.Create(item);
        
        if (newId == -1)
        {
            return Ok(new { success = false, message = "User with this code already exists" });
        }
        
        return Ok(new { success = newId > 0, id = newId });
    }

    [HttpPost("update")]
    public IActionResult Update([FromBody] UserMaster item)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values
                .SelectMany(x => x.Errors)
                .Select(x => x.ErrorMessage));
        }

        if (item == null || item.Id <= 0) return BadRequest();
        int result = _usersRepository.Update(item);
        
        if (result == -1)
        {
            return Ok(new { success = false, message = "User with this code already exists" });
        }
        
        return Ok(new { success = result > 0 });
    }

    [HttpPost("delete/{id}")]
    public IActionResult Delete(int id)
    {
        bool result = _usersRepository.Delete(id);
        return Ok(new { success = result });
    }

    [HttpPost("activeinactive")]
    public IActionResult ActiveInActive(int id, bool status)
    {
        bool result = _usersRepository.ActiveInActive(id, status);
        return Ok(new { success = result });
    }
}
