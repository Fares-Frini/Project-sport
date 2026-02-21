using Microsoft.AspNetCore.Mvc;
using ParaPharma.Infrastructure.Services;

namespace ParaPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EtlController : ControllerBase
    {
        private readonly EtlService _etlService;

        public EtlController(EtlService etlService)
        {
            _etlService = etlService;
        }

        /// <summary>
        /// Lance le processus ETL pour charger les données OLTP vers le DWH
        /// </summary>
        [HttpPost("load")]
        public async Task<IActionResult> LoadDwhData()
        {
            var result = await _etlService.LoadDwhDataAsync();

            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = new
                    {
                        customersLoaded = result.CustomersLoaded
                    },
                    warnings = result.Warnings
                });
            }

            return BadRequest(new
            {
                success = false,
                message = result.Message,
                warnings = result.Warnings
            });
        }
    }
}
