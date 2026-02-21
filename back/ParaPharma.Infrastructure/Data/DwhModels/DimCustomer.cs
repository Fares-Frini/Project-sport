using System.ComponentModel.DataAnnotations;

public class DimCustomer
{
    [Key]
    public int CustomerKey { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
