using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;

namespace ParaPharma.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<OrderDto?> GetByIdAsync(int id);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
        Task<OrderDto> CreateOrderAsync(int userId, OrderCreateDto orderCreateDto);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    }
}
