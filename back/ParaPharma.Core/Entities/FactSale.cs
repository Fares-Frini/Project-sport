using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore; // ← Maintenant disponible

namespace ParaPharma.Core.Entities.DWH
{
    [PrimaryKey(nameof(SalesOrderID), nameof(SalesOrderDetailID))]
    public class FactSale
    {
        public int SalesOrderID { get; set; }
        public int SalesOrderDetailID { get; set; }
        public string? CarrierTrackingNumber { get; set; }
        public short OrderQty { get; set; }
        public int ProductID { get; set; }
        public int? SpecialOfferID { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitPriceDiscount { get; set; }
        public decimal LineTotal { get; set; }
        public byte RevisionNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int? TerritoryID { get; set; }
        public int? SalesPersonID { get; set; }
        public int? CreditCardID { get; set; }

        // Navigation properties
        public DimProduct Product { get; set; } = null!;
        public DimSalesTerritory Territory { get; set; } = null!;
        public DimSalesPerson SalesPerson { get; set; } = null!;
        public DimCreditCard CreditCard { get; set; } = null!;
    }
}