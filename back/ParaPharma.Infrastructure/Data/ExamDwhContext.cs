using Microsoft.EntityFrameworkCore;
using ParaPharma.Core.Entities.DWH;
using ParaPharma.Core.Entities;

namespace ParaPharma.Infrastructure.Data
{
    public class ExamDwhContext : DbContext
    {
        public ExamDwhContext(DbContextOptions<ExamDwhContext> options)
            : base(options)
        {
        }

        // Dim tables
        public DbSet<DimPerson> DimPersons { get; set; }
        public DbSet<DimCreditCard> DimCreditCards { get; set; }
        public DbSet<DimCustomer> DimCustomers { get; set; }
        public DbSet<DimProduct> DimProducts { get; set; }
        public DbSet<DimProductSubCategory> DimProductSubCategories { get; set; }
        public DbSet<DimProductCategory> DimProductCategories { get; set; }
        public DbSet<DimSalesTerritory> DimSalesTerritories { get; set; }
        public DbSet<DimSalesPerson> DimSalesPersons { get; set; }

        // Fact tables
        public DbSet<FactSale> FactSales { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DimPerson>().ToTable("Dim_Person");
            modelBuilder.Entity<DimCreditCard>().ToTable("Dim_CreditCard");
            modelBuilder.Entity<DimCustomer>().ToTable("Dim_Customer");
            modelBuilder.Entity<DimProduct>().ToTable("Dim_Product");
            modelBuilder.Entity<DimProductSubCategory>().ToTable("Dim_Product_SubCategory");
            modelBuilder.Entity<DimProductCategory>().ToTable("Dim_Product_Category");
            modelBuilder.Entity<DimSalesTerritory>().ToTable("Dim_SalesTerritory");
            modelBuilder.Entity<DimSalesPerson>().ToTable("Dim_SalesPerson");
            modelBuilder.Entity<FactSale>().ToTable("Fact_Sales");

            // Configure FactSale relationships
            modelBuilder.Entity<FactSale>()
                .HasOne(f => f.Product)
                .WithMany(p => p.FactSales)
                .HasForeignKey(f => f.ProductID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<FactSale>()
                .HasOne(f => f.Territory)
                .WithMany(t => t.FactSales)
                .HasForeignKey(f => f.TerritoryID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<FactSale>()
                .HasOne(f => f.SalesPerson)
                .WithMany(sp => sp.FactSales)
                .HasForeignKey(f => f.SalesPersonID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<FactSale>()
                .HasOne(f => f.CreditCard)
                .WithMany()
                .HasForeignKey(f => f.CreditCardID)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}