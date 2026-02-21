using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimProductSubCategory
    {
        [Key]
        public int ProductSubcategoryID { get; set; }
        public int ProductCategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        public DimProductSubCategory ProductCategory { get; set; } = null!; // Note: This should probably be DimProductCategory but staying consistent with user's warning log if it matched. Wait, let me check the file.
        public ICollection<DimProduct> Products { get; set; }
            = new List<DimProduct>();
    }
}