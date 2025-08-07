using System.Text;
using CreativForge.Data;
using CreativForge.Services;
using CreativForge.Pdf;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=creativforge.db"));

builder.Services.AddSingleton<PromptService>();
builder.Services.AddSingleton<BriefService>();
builder.Services.AddSingleton<PlannerService>();
builder.Services.AddSingleton<PdfExporter>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<PromptService>();

var allowedOrigins = new[] {
    "http://localhost:3000", // React dev
    "http://localhost:5006", // Swagger 
    "https://localhost:3000" // https React dev
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Auth JWT
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrEmpty(jwtSecret))
    Console.WriteLine("WARNING: Jwt:Secret is missing! Check your config/env!");

var key = Encoding.ASCII.GetBytes(jwtSecret);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            NameClaimType = ClaimTypes.Email, // Use email as the unique identifier
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404 &&
        !System.IO.Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseCors("AllowFrontend");
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();