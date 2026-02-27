using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimCustomer
    {
        [Key]
        public int CustomerKey { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
}
