using System;

namespace BlindBag.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int BlindBagId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Navigation properties
        public Order Order { get; set; } = null!;
        public BlindBag BlindBag { get; set; } = null!;
    }
}
