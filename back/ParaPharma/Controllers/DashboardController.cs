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
                TotalOrders = await _oltpContext.Orders.CountAsync(),
                TotalRevenue = await _oltpContext.Orders.AnyAsync() ? await _oltpContext.Orders.SumAsync(o => o.TotalAmount) : 0
            };

            return Ok(kpis);
        }

        [HttpGet("monthly-sales")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetMonthlySales()
        {
            try
            {
                var orders = await _oltpContext.Orders.ToListAsync();
                var sales = orders
                    .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                    .Select(g => new SalesDataDto
                    {
                        Label = $"{g.Key.Month}/{g.Key.Year}",
                        Value = g.Sum(o => o.TotalAmount),
                        OrderCount = g.Count()
                    })
                    .OrderBy(x => {
                        var parts = x.Label.Split('/');
                        return int.Parse(parts[1]) * 100 + int.Parse(parts[0]);
                    })
                    .ToList();
                return Ok(sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("status-distribution")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetStatusDistribution()
        {
            var distribution = await _oltpContext.Orders
                .GroupBy(o => o.Status)
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(distribution);
        }

        [HttpGet("category-sales")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetCategorySales()
        {
            var categorySales = await _oltpContext.OrderDetails
                .Join(_oltpContext.Products, od => od.ProductId, p => p.Id, (od, p) => new { od, p })
                .Join(_oltpContext.Categories, x => x.p.CategoryId, c => c.Id, (x, c) => new { x.od, c })
                .GroupBy(x => x.c.Name)
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Sum(x => x.od.UnitPrice * x.od.Quantity)
                })
                .ToListAsync();

            return Ok(categorySales);
        }

        [HttpGet("subcategory-sales")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetSubCategorySales()
        {
            try
            {
                var data = await _oltpContext.OrderDetails
                    .Include(od => od.Product)
                    .ThenInclude(p => p!.SubCategory)
                    .ToListAsync();
                
                var result = data
                    .Where(od => od.Product != null)
                    .GroupBy(od => od.Product!.SubCategory != null ? od.Product.SubCategory.Name : "Sans sous-catégorie")
                    .Select(g => new SalesDataDto
                    {
                        Label = g.Key,
                        Value = g.Sum(od => od.UnitPrice * od.Quantity)
                    })
                    .OrderByDescending(x => x.Value)
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user-growth")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetUserGrowth()
        {
            var growth = await _oltpContext.Customers
                .GroupBy(c => new { Year = c.CreatedAt.Year, Month = c.CreatedAt.Month })
                .Select(g => new SalesDataDto
                {
                    Label = $"{g.Key.Month}/{g.Key.Year}",
                    Value = g.Count()
                })
                .ToListAsync();

            var sortedGrowth = growth
                .OrderBy(x => {
                    var parts = x.Label.Split('/');
                    if (parts.Length < 2) return 0;
                    return int.Parse(parts[1]) * 100 + int.Parse(parts[0]);
                })
                .ToList();

            return Ok(sortedGrowth);
        }

        [HttpGet("user-distribution")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetUserDistribution()
        {
            var distribution = await _oltpContext.AppUsers
                .GroupBy(u => u.Role) 
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(distribution);
        }

        [HttpGet("products-by-subcategory")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetProductsBySubCategory()
        {
            var data = await _oltpContext.Products
                .Include(p => p.SubCategory)
                .GroupBy(p => p.SubCategory != null ? p.SubCategory.Name : "Sans sous-catégorie")
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("stock-by-subcategory")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetStockBySubCategory()
        {
            var data = await _oltpContext.Products
                .Include(p => p.SubCategory)
                .GroupBy(p => p.SubCategory != null ? p.SubCategory.Name : "Sans sous-catégorie")
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Sum(p => p.StockQuantity)
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("price-distribution")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetPriceDistribution()
        {
            var products = await _oltpContext.Products.ToListAsync();
            
            var distribution = new List<SalesDataDto>
            {
                new SalesDataDto { Label = "< 100$", Value = products.Count(p => p.Price < 100) },
                new SalesDataDto { Label = "100$ - 500$", Value = products.Count(p => p.Price >= 100 && p.Price <= 500) },
                new SalesDataDto { Label = "500$ - 1500$", Value = products.Count(p => p.Price > 500 && p.Price <= 1500) },
                new SalesDataDto { Label = "> 1500$", Value = products.Count(p => p.Price > 1500) }
            };

            return Ok(distribution);
        }

        [HttpGet("top-products-oltp")]
        public async Task<ActionResult<IEnumerable<SalesDataDto>>> GetTopProductsOltp()
        {
            var topProducts = await _oltpContext.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.Product != null)
                .GroupBy(od => od.Product!.Name)
                .Select(g => new SalesDataDto
                {
                    Label = g.Key,
                    Value = g.Sum(od => od.Quantity) 
                })
                .OrderByDescending(x => x.Value)
                .Take(10)
                .ToListAsync();

            return Ok(topProducts);
        }

        [HttpGet("recent-orders")]
        public async Task<ActionResult<IEnumerable<RecentOrderDto>>> GetRecentOrders()
        {
            var recentOrders = await _oltpContext.Orders
                .Include(o => o.AppUser)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    CustomerName = o.AppUser != null ? $"{o.AppUser.FirstName} {o.AppUser.LastName}" : "Client Inconnu",
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(recentOrders);
        }

        [HttpGet("check-db")]
        public async Task<IActionResult> CheckDb()
        {
            var results = new Dictionary<string, string>();
            
            try 
            {
                results.Add("OLTP_ProductCount", (await _oltpContext.Products.CountAsync()).ToString());
                results.Add("OLTP_OrderCount", (await _oltpContext.Orders.CountAsync()).ToString());
                results.Add("OLTP_AppUserCount", (await _oltpContext.AppUsers.CountAsync()).ToString());
            }
            catch (Exception ex)
            {
                results.Add("OLTP_Error", ex.Message);
            }

            return Ok(results);
        }
    }
}
