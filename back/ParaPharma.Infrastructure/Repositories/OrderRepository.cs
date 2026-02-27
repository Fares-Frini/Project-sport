using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OltpDbContext _context;

        public OrderRepository(OltpDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.AppUser)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return null;

            return MapToDto(order);
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.AppUser)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.AppUser)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.AppUserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToDto);
        }

        public async Task<OrderDto> CreateOrderAsync(int userId, OrderCreateDto orderCreateDto)
        {
            var order = new Order
            {
                AppUserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = 0
            };

            foreach (var item in orderCreateDto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    var detail = new OrderDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                    order.OrderDetails.Add(detail);
                    order.TotalAmount += detail.Quantity * detail.UnitPrice;
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Reload with includes for the DTO
            return await GetByIdAsync(order.Id) ?? throw new Exception("Order creation failed");
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return false;

            order.Status = status;
            return await _context.SaveChangesAsync() > 0;
        }

        private OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                AppUserId = order.AppUserId,
                CustomerName = order.AppUser != null ? $"{order.AppUser.FirstName} {order.AppUser.LastName}" : "Unknown",
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDto
                {
                    ProductId = od.ProductId,
                    ProductName = od.Product?.Name ?? "Unknown Product",
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice
                }).ToList()
            };
        }
    }
}
