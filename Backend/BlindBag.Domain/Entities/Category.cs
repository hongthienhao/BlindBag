using System;
using System.Collections.Generic;

namespace BlindBag.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<BlindBag> BlindBags { get; set; } = new List<BlindBag>();
    }
}
