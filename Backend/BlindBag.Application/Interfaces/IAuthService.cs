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

        /// <summary>
        /// Xác thực người dùng và phát hành JSON Web Token.
        /// </summary>
        /// <param name="request">Email và Password từ client.</param>
        /// <returns>JWT token cùng thông tin cơ bản của user.</returns>
        /// <exception cref="UnauthorizedAccessException">Ném khi email/password không đúng.</exception>
        /// <exception cref="InvalidOperationException">Ném khi tài khoản đã bị vô hiệu hóa.</exception>
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    }
}
