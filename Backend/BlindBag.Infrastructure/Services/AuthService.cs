using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using BlindBag.Application.DTOs.Auth;
using BlindBag.Application.Interfaces;
using BlindBag.Domain.Entities;
using BlindBag.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BlindBag.Infrastructure.Services
{
    /// <summary>
    /// Triển khai nghiệp vụ xác thực người dùng.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <inheritdoc />
        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // 1. Kiểm tra email đã tồn tại chưa
            bool emailExists = await _context.Users
                .AnyAsync(u => u.Email == request.Email);

            if (emailExists)
            {
                throw new InvalidOperationException($"Email '{request.Email}' đã được sử dụng.");
            }

            // 2. Hash mật khẩu bằng BCrypt.Net-Next
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Tạo entity User
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = hashedPassword,
                Phone = request.Phone,
                Role = "Buyer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // 4. Tạo entity Wallet liên kết với User
            var wallet = new Wallet
            {
                Balance = 0.00m,
                CreatedAt = DateTime.UtcNow,
                User = user // EF Core sẽ tự gán UserId sau khi SaveChanges
            };

            // 5. Lưu cả hai trong cùng một transaction (EF Core SaveChanges là atomic)
            _context.Users.Add(user);
            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            // 6. Trả về DTO không chứa password
            return new RegisterResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                WalletId = wallet.Id,
                WalletBalance = wallet.Balance
            };
        }

        /// <inheritdoc />
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            // 1. Tìm user theo email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // 2. Không tìm thấy user → 401 (thông báo chung để tránh user enumeration)
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Tài khoản hoặc mật khẩu không chính xác.");
            }

            // 3. Tài khoản bị vô hiệu hóa → 403
            if (!user.IsActive)
            {
                throw new InvalidOperationException("Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
            }

            // 4. Đọc cấu hình JWT từ appsettings.json
            var jwtSection = _configuration.GetSection("Jwt");
            var secretKey = jwtSection["Key"]
                ?? throw new InvalidOperationException("Jwt:Key chưa được cấu hình trong appsettings.json.");
            var issuer = jwtSection["Issuer"] ?? "BlindBagAPI";
            var audience = jwtSection["Audience"] ?? "BlindBagClient";
            var expiredMinutes = int.TryParse(jwtSection["ExpiredMinutes"], out var mins) ? mins : 60;

            // 5. Tạo signing key và credentials
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var signingKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            // 6. Định nghĩa Claims
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // 7. Tạo JWT token
            var expiresAt = DateTime.UtcNow.AddMinutes(expiredMinutes);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiresAt,
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return new LoginResponseDto
            {
                Token = tokenString,
                TokenType = "Bearer",
                ExpiresAt = expiresAt,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
