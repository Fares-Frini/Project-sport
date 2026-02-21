// File: ParaPharma.Core/Entities/Product.cs
namespace ParaPharma.Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        
        // Navigation properties
        public Category? Category { get; set; }
        public SubCategory? SubCategory { get; set; }
    }
}