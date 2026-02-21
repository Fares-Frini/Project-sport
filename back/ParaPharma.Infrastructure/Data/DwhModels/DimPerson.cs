using System;
using System.ComponentModel.DataAnnotations;

public class DimPerson
{
    [Key]
    public int BusinessEntityID { get; set; }
    public string? PersonType { get; set; }
    public bool? NameStyle { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public int? EmailPromotion { get; set; }
    public DateTime? ModifiedDate { get; set; }
}
