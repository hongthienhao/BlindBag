using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlindBag.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProfileController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value 
                    ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
        var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value 
                   ?? User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

        return Ok(new 
        { 
            status = "success",
            user = new 
            {
                fullName = User.Identity?.Name ?? "Người dùng ẩn danh",
                email = email ?? "",
                role = role ?? "Buyer"
            }
        });
    }
}
