namespace ParaPharma.Core.DTOs
{
    public class DashboardKpiDto
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class SalesDataDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }
}
