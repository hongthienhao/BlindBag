using System;
using System.Collections.Generic;

namespace BlindBag.Domain.Entities
{
    public class WalletTransaction
    {
        public int Id { get; set; }
        public int WalletId { get; set; }
        public string TransactionType { get; set; } = string.Empty; // TopUp | Payment | Refund | Withdrawal | Adjustment
        public decimal Amount { get; set; }
        public decimal BalanceBefore { get; set; }
        public decimal BalanceAfter { get; set; }
        public string? ReferenceType { get; set; } // 'Order' | 'PaymentRequest' | NULL
        public int? ReferenceId { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Wallet Wallet { get; set; } = null!;
        public ICollection<PaymentRequest> PaymentRequests { get; set; } = new List<PaymentRequest>();
    }
}
