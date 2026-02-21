using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimSalesTerritory
    {
        [Key]
        public int TerritoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string CountryRegionCode { get; set; } = string.Empty;
        public string Group { get; set; } = string.Empty;
        public decimal? SalesYTD { get; set; }
        public decimal? SalesLastYear { get; set; }
        public decimal? CostYTD { get; set; }
        public decimal? CostLastYear { get; set; }

        // Navigation properties
        public ICollection<FactSale> FactSales { get; set; }
            = new List<FactSale>();
    }
}