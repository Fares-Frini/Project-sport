using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Interfaces;
using System.Security.Claims;

namespace ParaPharma.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;

        public OrdersController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(OrderCreateDto orderCreateDto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var order = await _orderRepository.CreateOrderAsync(userId, orderCreateDto);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/orders/my-orders
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var orders = await _orderRepository.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        // GET: api/orders
        [HttpGet]
        [Authorize(Roles = "admin,Admin")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            return Ok(orders);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return NotFound();

            // Check if user is admin or the owner of the order
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole?.ToLower() != "admin" && order.AppUserId.ToString() != userIdStr)
            {
                return Forbid();
            }

            return Ok(order);
        }

        // PATCH: api/orders/5/status
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "admin,Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var updated = await _orderRepository.UpdateOrderStatusAsync(id, status);
            if (!updated) return NotFound();

            return NoContent();
        }
    }
}
