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

    // ─── DimPerson ───────────────────────────────────────────────────────────

    /// <summary>GET: api/analytics/persons — Sample of 20 persons from DWH</summary>
    [HttpGet("persons")]
    public async Task<IActionResult> GetPersons()
    {
        var persons = await _context.DimPersons
            .Select(p => new { p.FirstName, p.LastName, p.EmailPromotion })
            .Take(20)
            .ToListAsync();
        return Ok(persons);
    }

    /// <summary>GET: api/analytics/persons-by-type — Count per PersonType</summary>
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

    /// <summary>GET: api/analytics/customers-count — Total customers in DimCustomer</summary>
    [HttpGet("customers-count")]
    public async Task<IActionResult> GetCustomerCount()
    {
        var count = await _context.DimCustomers.CountAsync();
        return Ok(new { TotalCustomers = count });
    }

    // ─── FactSale + Dim joins ─────────────────────────────────────────────────

    /// <summary>GET: api/analytics/top-products?limit=10 — Top N products by revenue (DWH)</summary>
    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int limit = 10)
    {
        var results = await _context.FactSales
            .Join(_context.DimProducts,
                f => f.ProductID,
                p => p.ProductID,
                (f, p) => new { f.LineTotal, ProductName = p.Name })
            .GroupBy(x => x.ProductName)
            .Select(g => new
            {
                Label = g.Key,
                Value = Math.Round(g.Sum(x => x.LineTotal), 2)
            })
            .OrderByDescending(x => x.Value)
            .Take(limit)
            .ToListAsync();
        return Ok(results);
    }

    /// <summary>GET: api/analytics/sales-by-territory — Total revenue per sales territory (DWH)</summary>
    [HttpGet("sales-by-territory")]
    public async Task<IActionResult> GetSalesByTerritory()
    {
        var results = await _context.FactSales
            .Where(f => f.TerritoryID != null)
            .Join(_context.DimSalesTerritories,
                f => f.TerritoryID,
                t => t.TerritoryID,
                (f, t) => new { t.Name, f.LineTotal })
            .GroupBy(x => x.Name)
            .Select(g => new
            {
                Label = g.Key,
                Value = Math.Round(g.Sum(x => x.LineTotal), 2)
            })
            .OrderByDescending(x => x.Value)
            .ToListAsync();
        return Ok(results);
    }

    /// <summary>GET: api/analytics/top-salespersons?limit=10 — Top N salespeople by revenue (DWH)</summary>
    [HttpGet("top-salespersons")]
    public async Task<IActionResult> GetTopSalesPersons([FromQuery] int limit = 10)
    {
        var results = await _context.FactSales
            .Where(f => f.SalesPersonID != null)
            .Join(_context.DimSalesPersons,
                f => f.SalesPersonID,
                sp => sp.SalesPersonID,
                (f, sp) => new { FullName = sp.FirstName + " " + sp.LastName, f.LineTotal })
            .GroupBy(x => x.FullName)
            .Select(g => new
            {
                Label = g.Key,
                Value = Math.Round(g.Sum(x => x.LineTotal), 2)
            })
            .OrderByDescending(x => x.Value)
            .Take(limit)
            .ToListAsync();
        return Ok(results);
    }

    /// <summary>GET: api/analytics/credit-cards-by-type — Distribution of credit card types (DWH)</summary>
    [HttpGet("credit-cards-by-type")]
    public async Task<IActionResult> GetCreditCardsByType()
    {
        var results = await _context.DimCreditCards
            .GroupBy(c => c.CardType)
            .Select(g => new { Label = g.Key, Value = g.Count() })
            .OrderByDescending(x => x.Value)
            .ToListAsync();
        return Ok(results);
    }
}