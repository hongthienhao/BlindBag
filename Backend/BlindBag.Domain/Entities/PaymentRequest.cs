using System;

namespace BlindBag.Domain.Entities
{
    public class PaymentRequest
    {
        public int Id { get; set; }
        public int WalletId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "VNPay";
        public string Status { get; set; } = "Pending"; // Pending | Completed | Failed | Cancelled | Expired
        
        public string? ExternalTransactionId { get; set; }
        public string? ExternalResponseCode { get; set; }
        public string? ExternalBankCode { get; set; }
        public string? RawCallbackData { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiredAt { get; set; } = DateTime.UtcNow.AddMinutes(15);
        public DateTime? CompletedAt { get; set; }

        public int? WalletTransactionId { get; set; }

        // Navigation properties
        public Wallet Wallet { get; set; } = null!;
        public WalletTransaction? WalletTransaction { get; set; }
    }
}
