using BlindBag.Application.DTOs.Auth;
using BlindBag.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlindBag.WebAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng ký người dùng mới.
        /// </summary>
        /// <param name="request">Thông tin đăng ký: Email, Password, FullName, Phone.</param>
        /// <returns>Thông tin user vừa tạo cùng Wallet tương ứng.</returns>
        /// <response code="201">Đăng ký thành công.</response>
        /// <response code="400">Dữ liệu đầu vào không hợp lệ.</response>
        /// <response code="409">Email đã tồn tại trong hệ thống.</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            // ModelState validation do [ApiController] + Data Annotations xử lý tự động (400)
            try
            {
                var result = await _authService.RegisterAsync(request);
                return StatusCode(StatusCodes.Status201Created, result);
            }
            catch (InvalidOperationException ex)
            {
                // Email đã tồn tại → 409 Conflict
                return Conflict(new { message = ex.Message });
            }
        }
    }
}
