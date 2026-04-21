using Microsoft.AspNetCore.Mvc;

namespace BlindBag.WebAPI.Controllers
{
    [ApiController]
    [Route("api/healthcheck")]
    public class HealthCheckController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "healthy", timestamp = System.DateTime.UtcNow });
        }
    }
}
