using ParaPharma.Core.DTOs;

namespace ParaPharma.Core.Interfaces;

public interface ICategoryRepository
{
    Task<CategoryDto> GetByIdAsync(int id);
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> AddAsync(CreateCategoryDto categoryDto);
    Task<CategoryDto> UpdateAsync(UpdateCategoryDto categoryDto);
    Task<bool> DeleteAsync(int id);
}