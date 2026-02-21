using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Interfaces;

namespace ParaPharma.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,Admin")] // Accepte les deux casses
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // GET: api/admin/ping (pour test, accessible sans token)
        [HttpGet("ping")]
        [AllowAnonymous]
        public IActionResult Ping() => Ok("pong");

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/admin/users/5
        [HttpGet("users/{id}")]
        public async Task<ActionResult<AdminUserDto>> GetUserById(int id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = $"Utilisateur avec l'id {id} non trouvé" });
            return Ok(user);
        }

        // POST: api/admin/users
        [HttpPost("users")]
        public async Task<ActionResult<AdminUserDto>> CreateUser(CreateUserDto createUserDto)
        {
            try
            {
                var user = await _adminService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/admin/users/5
        [HttpPut("users/{id}")]
        public async Task<ActionResult<AdminUserDto>> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _adminService.UpdateUserAsync(id, updateUserDto);
                if (user == null)
                    return NotFound(new { message = $"Utilisateur avec l'id {id} non trouvé" });
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/admin/users/5
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _adminService.DeleteUserAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Utilisateur avec l'id {id} non trouvé" });
            return NoContent();
        }
    }
}