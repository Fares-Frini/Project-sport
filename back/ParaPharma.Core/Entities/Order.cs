using System;
using System.Collections.Generic;

namespace ParaPharma.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int AppUserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";

        // Navigation properties
        public AppUser? AppUser { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
