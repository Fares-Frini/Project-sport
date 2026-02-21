namespace ParaPharma.Core.DTOs;

public class CreateSubCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
}
