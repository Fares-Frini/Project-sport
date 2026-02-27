using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.Entities;

namespace ParaPharma.Infrastructure.Data
{
    public class OltpDbContext : DbContext
    {
        public OltpDbContext(DbContextOptions<OltpDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration SubCategory -> Category
            modelBuilder.Entity<SubCategory>()
                .HasOne(s => s.Category)
                .WithMany()
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration Product -> SubCategory
            modelBuilder.Entity<Product>()
                .HasOne(p => p.SubCategory)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configuration précision décimale pour Price
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(10, 2);

            // Configuration de AppUser
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.FirstName)
                    .HasMaxLength(50);
                entity.Property(e => e.LastName)
                    .HasMaxLength(50);
                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.Role)
                    .HasMaxLength(20)
                    .HasDefaultValue("User");
                entity.HasIndex(e => e.Role);
            });

            // Configuration optionnelle pour Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.Description)
                    .HasMaxLength(500);
            });

            // Configuration optionnelle pour Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Description)
                    .HasMaxLength(1000);
                entity.Property(e => e.StockQuantity)
                    .HasDefaultValue(0);
            });

            // Configuration optionnelle pour Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.FirstName)
                    .HasMaxLength(50);
                entity.Property(e => e.LastName)
                    .HasMaxLength(50);
                entity.Property(e => e.Phone)
                    .HasMaxLength(20);
            });

            // Configuration pour Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.HasOne(e => e.AppUser)
                    .WithMany()
                    .HasForeignKey(e => e.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuration pour OrderDetail
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.HasOne(e => e.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}