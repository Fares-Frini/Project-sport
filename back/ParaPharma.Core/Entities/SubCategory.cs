using System.Collections.Generic;

namespace ParaPharma.Core.Entities
{
    public class SubCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
