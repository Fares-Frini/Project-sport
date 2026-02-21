using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;


namespace ParaPharma.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly OltpDbContext _context;

    public CategoryRepository(OltpDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto> GetByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return null!;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _context.Categories.ToListAsync();
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        }).ToList();
    }

    public async Task<CategoryDto> AddAsync(CreateCategoryDto categoryDto)
    {
        var category = new Category
        {
            Name = categoryDto.Name,
            Description = categoryDto.Description
        };

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }

    public async Task<CategoryDto> UpdateAsync(UpdateCategoryDto categoryDto)
    {
        var category = await _context.Categories.FindAsync(categoryDto.Id);
        if (category == null) return null!;

        category.Name = categoryDto.Name;
        category.Description = categoryDto.Description;

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;

        // Vérifier si des produits utilisent cette catégorie
        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
        {
            // Option 1: Ne pas supprimer (recommandé)
            // Option 2: Supprimer en cascade (dangereux)
            return false; // Empêche la suppression si des produits existent
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}