using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.DTOs;
using ParaPharma.Core.Entities;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly OltpDbContext _context;

    public AdminService(OltpDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AdminUserDto>> GetAllUsersAsync()
    {
        return await _context.AppUsers
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<AdminUserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.AppUsers.FindAsync(id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<AdminUserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = new AppUser
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
            Role = createUserDto.Role
        };

        await _context.AppUsers.AddAsync(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<AdminUserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _context.AppUsers.FindAsync(id);
        if (user is null) return null;

        if (updateUserDto.FirstName is not null)
            user.FirstName = updateUserDto.FirstName;

        if (updateUserDto.LastName is not null)
            user.LastName = updateUserDto.LastName;

        if (updateUserDto.Email is not null)
            user.Email = updateUserDto.Email.ToLower();

        if (updateUserDto.Password is not null)
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);

        if (updateUserDto.Role is not null)
            user.Role = updateUserDto.Role;

        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.AppUsers.FindAsync(id);
        if (user is null) return false;

        _context.AppUsers.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _context.AppUsers.AnyAsync(u => u.Email == email.ToLower());
    }

    private static AdminUserDto MapToDto(AppUser user)
    {
        return new AdminUserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role
        };
    }
}
