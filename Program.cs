using CreativForge.Models;
using CreativForge.Services;
using CreativForge.Pdf;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register custom services
builder.Services.AddSingleton<PromptService>();
builder.Services.AddSingleton<BriefService>();
builder.Services.AddSingleton<PlannerService>();
builder.Services.AddSingleton<PdfExporter>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files from wwwroot/
app.UseDefaultFiles();  // sert automatiquement index.html à la racine
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
