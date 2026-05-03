using BCrypt.Net;
using BlindBag.Application.DTOs.Auth;
using BlindBag.Application.Interfaces;
using BlindBag.Domain.Entities;
using BlindBag.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlindBag.Infrastructure.Services
{
    /// <summary>
    /// Triển khai nghiệp vụ xác thực người dùng.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
