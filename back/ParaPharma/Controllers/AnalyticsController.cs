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

    // GET: api/analytics/persons
    [HttpGet("persons")]
    public async Task<IActionResult> GetPersons()
    {
        var persons = await _context.DimPersons
            .Select(p => new
            {
                p.FirstName,
                p.LastName,
                p.EmailPromotion
            })
            .Take(20)
            .ToListAsync();

        return Ok(persons);
    }

    // GET: api/analytics/customers-count
    [HttpGet("customers-count")]
    public async Task<IActionResult> GetCustomerCount()
    {
        var count = await _context.DimCustomers.CountAsync();
        return Ok(new { TotalCustomers = count });
    }

    // GET: api/analytics/persons-by-type
    [HttpGet("persons-by-type")]
    public async Task<IActionResult> GetPersonDistribution()
    {
        var distribution = await _context.DimPersons
            .GroupBy(p => p.PersonType)
            .Select(g => new
            {
                Label = g.Key ?? "Inconnu",
                Value = g.Count()
            })
            .ToListAsync();

        return Ok(distribution);
    }
}
