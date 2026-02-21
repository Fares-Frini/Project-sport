using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly OltpDbContext _context;

    public ProductRepository(OltpDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return null!;

        return MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .ToListAsync();

        return products.Select(p => MapToDto(p)).ToList();
    }

    public async Task<ProductDto> AddAsync(CreateProductDto productDto)
    {
        // Note: CreateProductDto should also be aligned if needed, but for now we map manually
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description ?? string.Empty,
            Price = productDto.Price,
            StockQuantity = productDto.StockQuantity,
            CategoryId = productDto.CategoryId
        };

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task<ProductDto> UpdateAsync(UpdateProductDto productDto)
    {
        var product = await _context.Products.FindAsync(productDto.Id);
        if (product == null) return null!;

        product.Name = productDto.Name;
        product.Description = productDto.Description ?? string.Empty;
        product.Price = productDto.Price;
        product.StockQuantity = productDto.StockQuantity;
        product.CategoryId = productDto.CategoryId;

        await _context.SaveChangesAsync();
        return await GetByIdAsync(product.Id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId)
    {
        var products = await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .ToListAsync();

        return products.Select(p => MapToDto(p)).ToList();
    }

    private static ProductDto MapToDto(Product p) => new ProductDto
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        ListPrice = p.Price,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name,
        SubCategoryId = p.SubCategoryId,
        SubCategoryName = p.SubCategory?.Name ?? "N/A",
        StockQuantity = p.StockQuantity
    };
}