using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;

namespace ParaPharma.Core.Interfaces;

public interface IProductRepository
{
    Task<ProductDto> GetByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto> AddAsync(CreateProductDto productDto);
    Task<ProductDto> UpdateAsync(UpdateProductDto productDto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId);
}