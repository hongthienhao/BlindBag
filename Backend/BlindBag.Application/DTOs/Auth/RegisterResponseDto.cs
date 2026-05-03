namespace BlindBag.Application.DTOs.Auth
{
    public class RegisterResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int WalletId { get; set; }
        public decimal WalletBalance { get; set; }
    }
}
