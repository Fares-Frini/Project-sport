// File: ParaPharma.Core/DTOs/AuthResponseDto.cs
namespace ParaPharma.Core.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }

        // Optionnel : Ajoute seulement si nécessaire
        public string? RefreshToken { get; set; }
        public int? UserId { get; set; }
    }
}