using System;

namespace BlindBag.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int BlindBagId { get; set; }
        public int UserId { get; set; }
        public byte Rating { get; set; } // 1 - 5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public BlindBag BlindBag { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
