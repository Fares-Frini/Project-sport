using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.Entities;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.Infrastructure.Repositories
{
    public class SubCategoryRepository : ISubCategoryRepository
    {
        private readonly OltpDbContext _context;

        public SubCategoryRepository(OltpDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubCategoryDto>> GetAllAsync()
        {
            return await _context.SubCategories
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<SubCategoryDto?> GetByIdAsync(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            return subCategory == null ? null : MapToDto(subCategory);
        }

        public async Task<IEnumerable<SubCategoryDto>> GetByCategoryAsync(int categoryId)
        {
            return await _context.SubCategories
                .Where(s => s.CategoryId == categoryId)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<SubCategoryDto> AddAsync(CreateSubCategoryDto createDto)
        {
            var subCategory = new SubCategory
            {
                Name = createDto.Name,
                Description = createDto.Description,
                CategoryId = createDto.CategoryId
            };

            await _context.SubCategories.AddAsync(subCategory);
            await _context.SaveChangesAsync();

            return MapToDto(subCategory);
        }

        public async Task<SubCategoryDto?> UpdateAsync(UpdateSubCategoryDto updateDto)
        {
            var subCategory = await _context.SubCategories.FindAsync(updateDto.Id);
            if (subCategory == null) return null;

            subCategory.Name = updateDto.Name;
            subCategory.Description = updateDto.Description;
            subCategory.CategoryId = updateDto.CategoryId;

            await _context.SaveChangesAsync();
            return MapToDto(subCategory);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null) return false;

            _context.SubCategories.Remove(subCategory);
            await _context.SaveChangesAsync();
            return true;
        }

        private static SubCategoryDto MapToDto(SubCategory s) => new SubCategoryDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            CategoryId = s.CategoryId
        };
    }
}
