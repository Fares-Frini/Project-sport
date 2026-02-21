using System;
using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimPerson
    {
        [Key]
        public int BusinessEntityID { get; set; }  // ← Doit correspondre à la BD

        public string? PersonType { get; set; }
        public bool? NameStyle { get; set; }
        public string? Title { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Suffix { get; set; }
        public int? EmailPromotion { get; set; }
        public string? AdditionalContactInfo { get; set; }
        public string? Demographics { get; set; }
        public Guid? Rowguid { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}