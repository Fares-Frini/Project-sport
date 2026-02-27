using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParaPharma.Infrastructure.Data;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly ExamDwhContext _context;

    public AnalyticsController(ExamDwhContext context)
    {
        _context = context;
    }

    // ─── DWH Dashboard Endpoints ───────────────────────────────────────────

    /// <summary>GET: api/analytics/dwh/kpis</summary>
    [HttpGet("dwh/kpis")]
    public async Task<IActionResult> GetDwhKpis()
    {
        var totalRevenue = await _context.FactSales.SumAsync(f => f.LineTotal);
        var totalOrders = await _context.FactSales.Select(f => f.SalesOrderID).Distinct().CountAsync();
        var totalCustomers = await _context.DimCustomers.CountAsync();
        
        var kpis = new ParaPharma.Core.DTOs.Analytics.DwhKpiDto
        {
            TotalRevenue = Math.Round(totalRevenue, 2),
            TotalOrders = totalOrders,
            TotalCustomers = totalCustomers,
            AverageBasket = totalOrders > 0 ? Math.Round(totalRevenue / totalOrders, 2) : 0
        };

        return Ok(kpis);
    }

    /// <summary>GET: api/analytics/dwh/sales-by-category</summary>
    [HttpGet("dwh/sales-by-category")]
    public async Task<IActionResult> GetSalesByCategory()
    {
        var results = await _context.FactSales
            .Join(_context.DimProducts, f => f.ProductID, p => p.ProductID, (f, p) => new { f, p })
            .Join(_context.DimProductSubCategories, x => x.p.ProductSubcategoryID, s => s.ProductSubcategoryID, (x, s) => new { x.f, s })
            .Join(_context.DimProductCategories, x => x.s.ProductCategoryID, c => c.ProductCategoryID, (x, c) => new { x.f, c })
            .GroupBy(x => x.c.Name)
            .Select(g => new ParaPharma.Core.DTOs.Analytics.CategoryRevenueDto
            {
                Category = g.Key,
                Revenue = Math.Round(g.Sum(x => x.f.LineTotal), 2)
            })
            .OrderByDescending(x => x.Revenue)
            .ToListAsync();

        return Ok(results);
    }

    /// <summary>GET: api/analytics/dwh/monthly-sales-trend</summary>
    [HttpGet("dwh/monthly-sales-trend")]
    public async Task<IActionResult> GetMonthlySalesTrend()
    {
        var results = await _context.FactSales
            .GroupBy(f => new { f.OrderDate.Year, f.OrderDate.Month })
            .Select(g => new ParaPharma.Core.DTOs.Analytics.MonthlySalesTrendDto
            {
                MonthLabel = $"{g.Key.Month}/{g.Key.Year}",
                Revenue = Math.Round(g.Sum(x => x.LineTotal), 2)
            })
            .ToListAsync();

        // Sort chronologically in memory (simplified)
        var ordered = results
            .OrderBy(x => DateTime.ParseExact(x.MonthLabel, "M/yyyy", System.Globalization.CultureInfo.InvariantCulture))
            .ToList();

        return Ok(ordered);
    }

    /// <summary>GET: api/analytics/dwh/top-products-performance</summary>
    [HttpGet("dwh/top-products-performance")]
    public async Task<IActionResult> GetTopProductsPerformance()
    {
        var results = await _context.FactSales
            .Join(_context.DimProducts, f => f.ProductID, p => p.ProductID, (f, p) => new { f, p })
            .GroupBy(x => x.p.Name)
            .Select(g => new ParaPharma.Core.DTOs.Analytics.ProductPerformanceDto
            {
                ProductName = g.Key,
                Revenue = Math.Round(g.Sum(x => x.f.LineTotal), 2),
                AverageDiscount = Math.Round(g.Average(x => x.f.UnitPriceDiscount), 4),
                TotalQty = g.Sum(x => x.f.OrderQty)
            })
            .OrderByDescending(x => x.Revenue)
            .Take(20)
            .ToListAsync();

        return Ok(results);
    }

    /// <summary>GET: api/analytics/dwh/salesperson-performance</summary>
    [HttpGet("dwh/salesperson-performance")]
    public async Task<IActionResult> GetSalesPersonPerformance()
    {
        var results = await _context.FactSales
            .Where(f => f.SalesPersonID != null)
            .Join(_context.DimSalesPersons, f => f.SalesPersonID, sp => sp.SalesPersonID, (f, sp) => new { f, sp })
            .GroupBy(x => new { x.sp.FirstName, x.sp.LastName, x.sp.SalesQuota })
            .Select(g => new ParaPharma.Core.DTOs.Analytics.SalesPersonPerformanceDto
            {
                FullName = $"{g.Key.FirstName} {g.Key.LastName}",
                Revenue = Math.Round(g.Sum(x => x.f.LineTotal), 2),
                Quota = g.Key.SalesQuota
            })
            .OrderByDescending(x => x.Revenue)
            .ToListAsync();

        return Ok(results);
    }

    /// <summary>GET: api/analytics/dwh/customer-segmentation")]
    [HttpGet("dwh/customer-segmentation")]
    public async Task<IActionResult> GetCustomerSegmentation()
    {
        // Simple segmentation based on person type for demo
        var results = await _context.DimPersons
            .GroupBy(p => p.PersonType)
            .Select(g => new ParaPharma.Core.DTOs.Analytics.CustomerSegmentDto
            {
                Segment = g.Key ?? "Other",
                Count = g.Count()
            })
            .ToListAsync();

        return Ok(results);
    }

    // ─── Legacy Compatibility Endpoints (for old Dashboard) ───────────────

    [HttpGet("persons")]
    public async Task<IActionResult> GetPersons()
    {
        var persons = await _context.DimPersons
            .Select(p => new { p.FirstName, p.LastName, p.EmailPromotion })
            .Take(20)
            .ToListAsync();
        return Ok(persons);
    }

    [HttpGet("persons-by-type")]
    public async Task<IActionResult> GetPersonDistribution()
    {
        var distribution = await _context.DimPersons
            .GroupBy(p => p.PersonType)
            .Select(g => new { Label = g.Key ?? "Inconnu", Value = g.Count() })
            .OrderByDescending(x => x.Value)
            .ToListAsync();
        return Ok(distribution);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int limit = 10)
    {
        var results = await _context.FactSales
            .Join(_context.DimProducts, f => f.ProductID, p => p.ProductID, (f, p) => new { f.LineTotal, ProductName = p.Name })
            .GroupBy(x => x.ProductName)
            .Select(g => new { Label = g.Key, Value = Math.Round(g.Sum(x => x.LineTotal), 2) })
            .OrderByDescending(x => x.Value)
            .Take(limit)
            .ToListAsync();
        return Ok(results);
    }

    [HttpGet("sales-by-city")]
    public async Task<IActionResult> GetSalesByCity()
    {
        // FactSales doesn't have City directly, usually joined via DimCustomer or similar
        // For compatibility, returning empty or mocked from territory if needed
        return Ok(new List<object>()); 
    }

    [HttpGet("sales-by-country")]
    [HttpGet("sales-by-territory")]
    public async Task<IActionResult> GetSalesByCountry()
    {
        var results = await _context.FactSales
            .Where(f => f.TerritoryID != null)
            .Join(_context.DimSalesTerritories, f => f.TerritoryID, t => t.TerritoryID, (f, t) => new { t.Name, f.LineTotal })
            .GroupBy(x => x.Name)
            .Select(g => new { Label = g.Key, Value = Math.Round(g.Sum(x => x.LineTotal), 2) })
            .ToListAsync();
        return Ok(results);
    }

    [HttpGet("top-salespersons")]
    public async Task<IActionResult> GetTopSalesPersons([FromQuery] int limit = 10)
    {
        var results = await _context.FactSales
            .Where(f => f.SalesPersonID != null)
            .Join(_context.DimSalesPersons, f => f.SalesPersonID, sp => sp.SalesPersonID, (f, sp) => new { f, sp })
            .GroupBy(x => new { x.sp.FirstName, x.sp.LastName })
            .Select(g => new
            {
                Label = $"{g.Key.FirstName} {g.Key.LastName}",
                Value = Math.Round(g.Sum(x => x.f.LineTotal), 2)
            })
            .OrderByDescending(x => x.Value)
            .Take(limit)
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("credit-cards-by-type")]
    public async Task<IActionResult> GetCreditCardsByType()
    {
        var results = await _context.FactSales
            .Join(_context.DimCreditCards, f => f.CreditCardID, c => c.CreditCardID, (f, c) => new { c.CardType, f.LineTotal })
            .GroupBy(x => x.CardType)
            .Select(g => new
            {
                Label = g.Key,
                Value = g.Count()
            })
            .ToListAsync();

        return Ok(results);
    }
}
