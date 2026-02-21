using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimSalesPerson
    {
        [Key]
        public int SalesPersonID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public decimal? SalesQuota { get; set; }
        public decimal? Bonus { get; set; }
        public decimal? CommissionPct { get; set; }
        public decimal? SalesYTD { get; set; }
        public decimal? SalesLastYear { get; set; }

        // Navigation properties
        public ICollection<FactSale> FactSales { get; set; }
            = new List<FactSale>();
    }
}