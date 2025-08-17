// Program.cs
using System.Security.Claims;
using CreativForge.Data;
using CreativForge.Models;
using CreativForge.Pdf;
using CreativForge.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- MVC / Swagger / HTTP ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// --- Database (SQLite) ---
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Prefer using a connection string in appsettings
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")
        ?? "Data Source=creativforge.db");
});

// --- App services ---
builder.Services.AddSingleton<PromptService>();
builder.Services.AddSingleton<BriefService>();
builder.Services.AddSingleton<PlannerService>();
builder.Services.AddSingleton<PdfExporter>();
// TokenService kept only if used elsewhere (not needed for cookie auth)
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<PromptService>();

// --- CORS (dev-friendly, allows cookies) ---
var allowedOrigins = new[]
{
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:5006"
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

// --- Authentication: Cookie + Google ---
var frontendUrl = builder.Configuration["Authentication:FrontendUrl"] ?? "http://localhost:3000";
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
if (string.IsNullOrWhiteSpace(googleClientId) || string.IsNullOrWhiteSpace(googleClientSecret))
{
    throw new InvalidOperationException(
        "Missing Google OAuth config. Set Authentication:Google:ClientId and Authentication:Google:ClientSecret.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        // In dev: Lax + not secure; in prod: None + Always (HTTPS)
        options.Cookie.Name = "cf_auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;               // dev
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;    // dev
        options.LoginPath = "/api/auth/google/login";
        options.LogoutPath = "/api/auth/logout";
    })
    .AddGoogle(options =>
    {
        options.ClientId = googleClientId!;
        options.ClientSecret = googleClientSecret!;
        options.CallbackPath = "/signin-google"; // must match Google console
        options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
        options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
        options.SaveTokens = false;
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// --- Migrate DB on startup (dev convenience) ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// --- Swagger (dev only) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- SPA fallback (only when not hitting /api) ---
app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404
        && !System.IO.Path.HasExtension(context.Request.Path.Value)
        && !context.Request.Path.Value!.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
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
