// File: ParaPharma.Core/Interfaces/IAuthService.cs
using ParaPharma.Core.DTOs;

namespace ParaPharma.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<bool> UserExistsAsync(string email);
    }
}