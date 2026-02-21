using Microsoft.EntityFrameworkCore;
using ParaPharma.Infrastructure.Data;

namespace ParaPharma.Infrastructure.Services
{
    public class EtlService
    {
        private readonly OltpDbContext _oltpContext;
        private readonly ExamDwhContext _dwhContext;

        public EtlService(OltpDbContext oltpContext, ExamDwhContext dwhContext)
        {
            _oltpContext = oltpContext;
            _dwhContext = dwhContext;
        }

        public async Task<EtlResult> LoadDwhDataAsync()
        {
            var result = new EtlResult();

            try
            {
                // 1. Charger DimCustomers depuis Customers OLTP
                await LoadCustomersAsync(result);

                // 2. Sauvegarder les changements
                await _dwhContext.SaveChangesAsync();

                result.Success = true;
                result.Message = "ETL terminé avec succès";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Erreur ETL: {ex.Message}";
            }

            return result;
        }

        private async Task LoadCustomersAsync(EtlResult result)
        {
            // Récupérer les customers depuis OLTP
            var oltpCustomers = await _oltpContext.Customers
                .AsNoTracking()
                .ToListAsync();

            if (!oltpCustomers.Any())
            {
                result.AddWarning("Aucun customer trouvé dans OLTP");
                return;
            }

            // Nettoyer les anciennes données DWH
            _dwhContext.DimCustomers.RemoveRange(_dwhContext.DimCustomers);

            // Transformer et charger dans DWH
            foreach (var customer in oltpCustomers)
            {
                var dimCustomer = new DimCustomer
                {
                    CustomerKey = customer.Id,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName
                };

                _dwhContext.DimCustomers.Add(dimCustomer);
            }

            result.CustomersLoaded = oltpCustomers.Count;
        }
    }

    public class EtlResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int CustomersLoaded { get; set; }
        public List<string> Warnings { get; set; } = new();

        public void AddWarning(string warning)
        {
            Warnings.Add(warning);
        }
    }
}
