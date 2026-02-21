using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.DTOs;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly OltpDbContext _oltpContext;
        private readonly ExamDwhContext _dwhContext;

        public DashboardController(OltpDbContext oltpContext, ExamDwhContext dwhContext)
        {
            _oltpContext = oltpContext;
            _dwhContext = dwhContext;
        }

        [HttpGet("kpis")]
        public async Task<ActionResult<DashboardKpiDto>> GetKpis()
        {
            var kpis = new DashboardKpiDto
            {
                TotalProducts = await _oltpContext.Products.CountAsync(),
                TotalCategories = await _oltpContext.Categories.CountAsync(),
                TotalUsers = await _oltpContext.AppUsers.CountAsync(),
                TotalCustomers = await _oltpContext.Customers.CountAsync(),
                // Simulate orders and revenue from DWH if FactSale is complex or just count Customers for now as dummy
                TotalOrders = 150, // Placeholder for orders
                TotalRevenue = 12500.50m // Placeholder for revenue
            };

            return Ok(kpis);
        }

        [HttpGet("monthly-sales")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetMonthlySales()
        {
            // Dummy data for Chart.js
            var sales = new List<SalesDataDto>
            {
                new SalesDataDto { Label = "Jan", Value = 1200 },
                new SalesDataDto { Label = "Feb", Value = 1900 },
                new SalesDataDto { Label = "Mar", Value = 3000 },
                new SalesDataDto { Label = "Apr", Value = 2500 },
                new SalesDataDto { Label = "May", Value = 4200 },
                new SalesDataDto { Label = "Jun", Value = 3800 }
            };

            return Ok(sales);
        }

        [HttpGet("category-sales")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetCategorySales()
        {
            var categorySales = await _oltpContext.Categories
                .Select(c => new SalesDataDto
                {
                    Label = c.Name,
                    Value = _oltpContext.Products.Count(p => p.CategoryId == c.Id) * 100 // Dummy value calculation
                })
                .ToListAsync();

            return Ok(categorySales);
        }
        [HttpGet("check-db")]
        public async Task<IActionResult> CheckDb()
        {
            var results = new Dictionary<string, string>();
            
            try 
            {
                var productCount = await _oltpContext.Products.CountAsync();
                var categoryCount = await _oltpContext.Categories.CountAsync();
                var subCategoryCount = await _oltpContext.SubCategories.CountAsync();
                
                results.Add("OLTP_Status", "OK");
                results.Add("OLTP_ProductCount", productCount.ToString());
                results.Add("OLTP_CategoryCount", categoryCount.ToString());
                results.Add("OLTP_SubCategoryCount", subCategoryCount.ToString());
            }
            catch (Exception ex)
            {
                results.Add("OLTP_Error", ex.Message);
            }

            try 
            {
                var personCount = await _dwhContext.DimPersons.CountAsync();
                results.Add("DWH_Status", "OK");
                results.Add("DWH_PersonCount", personCount.ToString());
            }
            catch (Exception ex)
            {
                results.Add("DWH_Error", ex.Message);
            }

            return Ok(results);
        }
    }
}
