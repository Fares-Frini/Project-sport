using Microsoft.AspNetCore.Mvc;
using ParaPharma.Infrastructure.Data;
using ParaPharma.Core.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace ParaPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly OltpDbContext _context;

        public SeedController(OltpDbContext context)
        {
            _context = context;
        }

        [HttpPost("seed-customers")]
        public async Task<IActionResult> SeedCustomers()
        {
            if (_context.Customers.Any())
            {
                return Ok(new { message = "Des customers existent déjà", count = _context.Customers.Count() });
            }

            var customers = new List<Customer>
            {
                new Customer { FirstName = "Mohamed", LastName = "Alami", Email = "mohamed.alami@email.com", Phone = "0612345678" },
                new Customer { FirstName = "Fatima", LastName = "Zahra", Email = "fatima.zahra@email.com", Phone = "0623456789" }
            };

            await _context.Customers.AddRangeAsync(customers);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Customers créés avec succès", count = customers.Count });
        }

        [HttpPost("seed-products")]
        public async Task<IActionResult> SeedProducts()
        {
            var results = new List<string>();

            // 1. Categories
            if (!_context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Vélos", Description = "Vélos de route et de montagne" },
                    new Category { Name = "Accessoires", Description = "Casques, gants, pompes" },
                    new Category { Name = "Vêtements", Description = "Maillots, shorts, vestes" }
                };
                await _context.Categories.AddRangeAsync(categories);
                await _context.SaveChangesAsync();
                results.Add("Catégories créées");
            }
            else
            {
                results.Add("Les catégories existent déjà");
            }

            // 2. SubCategories
            if (!_context.SubCategories.Any())
            {
                var catVelos = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Vélos");
                var catAccessoires = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Accessoires");

                if (catVelos != null && catAccessoires != null)
                {
                    var subCategories = new List<SubCategory>
                    {
                        new SubCategory { Name = "Vélos de Route", CategoryId = catVelos.Id },
                        new SubCategory { Name = "VTT", CategoryId = catVelos.Id },
                        new SubCategory { Name = "Casques", CategoryId = catAccessoires.Id }
                    };
                    await _context.SubCategories.AddRangeAsync(subCategories);
                    await _context.SaveChangesAsync();
                    results.Add("Sous-catégories créées");
                }
            }
            else
            {
                results.Add("Les sous-catégories existent déjà");
            }

            // 3. Products
            if (!_context.Products.Any())
            {
                var catVelos = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Vélos");
                var subVtt = await _context.SubCategories.FirstOrDefaultAsync(s => s.Name == "VTT");

                if (catVelos != null)
                {
                    var products = new List<Product>
                    {
                        new Product { Name = "Vélo de Course Premium", Price = 2500m, CategoryId = catVelos.Id, SubCategoryId = subVtt?.Id },
                        new Product { Name = "VTT All-Mountain", Price = 1800m, CategoryId = catVelos.Id, SubCategoryId = subVtt?.Id }
                    };
                    await _context.Products.AddRangeAsync(products);
                    await _context.SaveChangesAsync();
                    results.Add("Produits créés");
                }
            }
            else
            {
                results.Add("Les produits existent déjà");
            }

            return Ok(new { messages = results });
        }
        [HttpPost("seed-users")]
        public async Task<IActionResult> SeedUsers()
        {
            if (_context.AppUsers.Any())
            {
                return Ok(new { message = "Des utilisateurs existent déjà" });
            }

            var users = new List<AppUser>
            {
                new AppUser 
                { 
                    FirstName = "Admin", 
                    LastName = "User", 
                    Email = "admin@test.com", 
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"), 
                    Role = "Admin" 
                },
                new AppUser 
                { 
                    FirstName = "Test", 
                    LastName = "User", 
                    Email = "user@test.com", 
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123"), 
                    Role = "User" 
                }
            };

            await _context.AppUsers.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Utilisateurs de test créés avec succès", count = users.Count });
        }
    }
}
