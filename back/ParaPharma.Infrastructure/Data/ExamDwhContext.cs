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

        public DbSet<DimPerson> DimPersons { get; set; }
        public DbSet<DimCreditCard> DimCreditCards { get; set; }
        public DbSet<DimCustomer> DimCustomers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DimPerson>().ToTable("Dim_Person");
            modelBuilder.Entity<DimCreditCard>().ToTable("Dim_CreditCard");
            modelBuilder.Entity<DimCustomer>().ToTable("Dim_Customer");
        }
    }
}
