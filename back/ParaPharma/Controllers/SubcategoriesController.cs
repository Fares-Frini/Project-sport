using Microsoft.AspNetCore.Mvc;
using ParaPharma.Core.Interfaces;
using ParaPharma.Core.DTOs;

namespace ParaPharma.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly ISubCategoryRepository _repository;

        public SubcategoriesController(ISubCategoryRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetSubcategories()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetSubcategory(int id)
        {
            var result = await _repository.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetSubcategoriesByCategory(int categoryId)
        {
            var result = await _repository.GetByCategoryAsync(categoryId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<SubCategoryDto>> CreateSubcategory(CreateSubCategoryDto createDto)
        {
            var result = await _repository.AddAsync(createDto);
            return CreatedAtAction(nameof(GetSubcategory), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubcategory(int id, UpdateSubCategoryDto updateDto)
        {
            if (id != updateDto.Id) return BadRequest();
            var result = await _repository.UpdateAsync(updateDto);
            if (result == null) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubcategory(int id)
        {
            var result = await _repository.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
