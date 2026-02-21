using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ParaPharma.Core.Entities.DWH
{
    public class DimCreditCard
    {
        [Key]
        public int CreditCardID { get; set; }
        public string CardType { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public byte ExpMonth { get; set; }
        public short ExpYear { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public ICollection<FactSale> FactSales { get; set; } = new List<FactSale>();
    }
}