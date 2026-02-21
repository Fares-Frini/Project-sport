using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimProductCategory
    {
        [Key]
        public int ProductCategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public Guid? rowguid { get; set; }
        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        public ICollection<DimProductSubCategory> ProductSubCategories { get; set; }
            = new List<DimProductSubCategory>();
    }
}