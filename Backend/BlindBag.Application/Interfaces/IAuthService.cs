using BlindBag.Application.DTOs.Auth;

namespace BlindBag.Application.Interfaces
{
    /// <summary>
    /// Định nghĩa contract cho các nghiệp vụ xác thực người dùng.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Đăng ký người dùng mới.
        /// </summary>
        /// <param name="request">Thông tin đăng ký từ client.</param>
        /// <returns>Thông tin user vừa tạo (không chứa password).</returns>
        /// <exception cref="InvalidOperationException">Ném khi email đã tồn tại.</exception>
        Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);
    }
}
