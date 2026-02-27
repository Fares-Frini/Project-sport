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
        public DimProductCategory ProductCategory { get; set; } = null!; 
        public ICollection<DimProduct> Products { get; set; }
            = new List<DimProduct>();
    }
}