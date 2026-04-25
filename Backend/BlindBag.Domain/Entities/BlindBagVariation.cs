using System;

namespace BlindBag.Domain.Entities
{
    public class BlindBagVariation
    {
        public int Id { get; set; }
        public int BlindBagId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal ProbabilityWeight { get; set; } // Ví dụ: 80, 15, 5 (tương đương %)
        public string? ImageUrl { get; set; }

        public BlindBag BlindBag { get; set; } = null!;
    }
}
