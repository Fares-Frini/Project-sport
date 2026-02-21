namespace ParaPharma.Core.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; } // Maintain for compatibility
    public decimal ListPrice { get; set; } // Used by frontend list
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? SubCategoryId { get; set; }
    public string? SubCategoryName { get; set; } // Used by frontend list
    public int StockQuantity { get; set; }
}