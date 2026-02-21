using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ParaPharma.Core.Interfaces;
using ParaPharma.Infrastructure.Data;
using ParaPharma.Infrastructure.Services;
using ParaPharma.Infrastructure.Repositories;
using System.Text;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<EtlService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();

// --- DbContexts (PostgreSQL via Npgsql) ---
var oltpConnStr = builder.Configuration.GetConnectionString("OltpConnection")
    ?? throw new InvalidOperationException("OltpConnection manquant");
var dwhConnStr = builder.Configuration.GetConnectionString("ExamDWHConnection")
    ?? throw new InvalidOperationException("ExamDWHConnection manquant");

builder.Services.AddDbContext<OltpDbContext>(options =>
    options.UseNpgsql(oltpConnStr));

builder.Services.AddDbContext<ExamDwhContext>(options =>
    options.UseNpgsql(dwhConnStr));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ??
                    throw new InvalidOperationException("JWT Key not configured")))
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- Swagger + JWT ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ParaPharma API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Exemple : \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// --- Seed default admin user on first deployment ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OltpDbContext>();

    // Create all tables from the EF Core model if they don't exist yet
    db.Database.EnsureCreated();

    var adminEmail = app.Configuration["AdminSeed:Email"] ?? "admin@parapharma.com";
    var adminPassword = app.Configuration["AdminSeed:Password"] ?? "Admin@123456";

    if (!db.AppUsers.Any(u => u.Role == "Admin"))
    {
        db.AppUsers.Add(new ParaPharma.Core.Entities.AppUser
        {
            FirstName = "Admin",
            LastName  = "ParaPharma",
            Email     = adminEmail.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role      = "Admin"
        });
        db.SaveChanges();
        Console.WriteLine($"[Seed] Admin user created: {adminEmail}");
    }
}

app.Run();
