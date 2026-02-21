namespace ParaPharma.Core.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Use PasswordHash, not Password
        public string Role { get; set; } = string.Empty;
    }
}