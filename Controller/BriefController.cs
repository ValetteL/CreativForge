using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CreativForge.Data;
using CreativForge.Models;

[ApiController]
[Route("api/[controller]")]
public class BriefController : ControllerBase
{
    private readonly AppDbContext _db;

    public BriefController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyBriefs()
    {
        var email = User.Identity?.Name;
        if (string.IsNullOrEmpty(email))
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.Briefs)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            return NotFound("Utilisateur inconnu.");

        var briefs = user.Briefs.Select(b => new BriefDto
        {
            Id = b.Id,
            Title = b.Title,
            Objective = b.Objective,
            Audience = b.Audience,
            Platform = b.Platform
        }).ToList();

        return Ok(briefs);
    }

    
    /// <summary>
    /// Save a new brief for the currently authenticated user (JWT required).
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddBrief([FromBody] BriefDto dto)
    {
        Console.WriteLine("[DEBUG] Identity.Name: " + User.Identity?.Name);
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"[DEBUG] Claim {claim.Type}: {claim.Value}");
        }

        // Extract user email from JWT
        var email = User.Identity?.Name;
        if (string.IsNullOrEmpty(email))
            return Unauthorized();

        // Find the user in the database
        var user = await _db.Users.Include(u => u.Briefs).FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return NotFound("Utilisateur inconnu.");

        // Check if a similar brief already exists (optional: by title)
        if (user.Briefs.Any(b => b.Title == dto.Title))
            return Conflict("Brief déjà sauvegardé.");

        // Create and attach the new brief
        var brief = new Brief
        {
            Title = dto.Title,
            Objective = dto.Objective,
            Audience = dto.Audience,
            Platform = dto.Platform,
            User = user
        };
        
        user.Briefs.Add(brief);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Brief sauvegardé.",
            brief = new { brief.Id, brief.Title, brief.Objective, brief.Audience, brief.Platform }
        });
    }
}

// DTO for input validation (avoid trusting front!)
public class BriefDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Objective { get; set; }
    public string Audience { get; set; }
    public string Platform { get; set; }
}
