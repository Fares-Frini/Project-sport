using System;

namespace ParaPharma.Core.DTOs.Analytics
{
    public class DwhKpiDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageBasket { get; set; }
        public int TotalCustomers { get; set; }
    }

    public class CategoryRevenueDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class MonthlySalesTrendDto
    {
        public string MonthLabel { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class TerritorySalesDto
    {
        public string Territory { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class ProductPerformanceDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal AverageDiscount { get; set; }
        public int TotalQty { get; set; }
    }

    public class SalesPersonPerformanceDto
    {
        public string FullName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal? Quota { get; set; }
        public decimal SuccessRate => Quota > 0 ? (Revenue / Quota.Value) * 100 : 0;
    }

    public class CustomerSegmentDto
    {
        public string Segment { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
