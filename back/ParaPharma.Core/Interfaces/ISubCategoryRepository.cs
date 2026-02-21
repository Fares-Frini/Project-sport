using ParaPharma.Core.DTOs;

namespace ParaPharma.Core.Interfaces
{
    public interface ISubCategoryRepository
    {
        Task<IEnumerable<SubCategoryDto>> GetAllAsync();
        Task<SubCategoryDto?> GetByIdAsync(int id);
        Task<IEnumerable<SubCategoryDto>> GetByCategoryAsync(int categoryId);
        Task<SubCategoryDto> AddAsync(CreateSubCategoryDto createDto);
        Task<SubCategoryDto?> UpdateAsync(UpdateSubCategoryDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}
