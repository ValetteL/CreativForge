using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CreativForge.Data;
using CreativForge.Models;
using CreativForge.DTOs;
using CreativForge.Services;

namespace CreativForge.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/brief")]
    public class BriefController : ControllerBase
    {
        private readonly AppDbContext _db;

        private readonly BriefService _briefService;

        public BriefController(AppDbContext db, BriefService briefService)
        {
            _db = db;
            _briefService = briefService;
        }

        /// <summary>
        /// Get a single brief by ID (with prompt included).
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrief(int id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var brief = await _db.Briefs
                .Include(b => b.Prompt)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id && b.User.Email == email);

            if (brief == null)
                return NotFound();

            var dto = new BriefDto
            {
                Id = brief.Id,
                Title = brief.Title,
                Objective = brief.Objective,
                Audience = brief.Audience,
                Platform = brief.Platform,
                Prompt = brief.Prompt != null ? new PromptDto
                {
                    Theme = brief.Prompt.Theme,
                    Constraint = brief.Prompt.Constraint,
                    Format = brief.Prompt.Format
                } : null
            };

            return Ok(dto);
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrief(int id)
        {
            // Get user email from JWT claims
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var user = await _db.Users.Include(u => u.Briefs)
                                    .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound();

            var brief = user.Briefs.FirstOrDefault(b => b.Id == id);
            if (brief == null)
                return NotFound();

            _db.Briefs.Remove(brief);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Brief supprimé." });
        }

        /// <summary>
        /// Update a brief (granular prompt/brief edition).
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrief(int id, [FromBody] BriefDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var brief = await _db.Briefs.Include(b => b.Prompt).Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id && b.User.Email == email);

            if (brief == null)
                return NotFound();

            // Update brief
            brief.Title = dto.Title;
            brief.Objective = dto.Objective;
            brief.Audience = dto.Audience;
            brief.Platform = dto.Platform;

            // Update prompt (if present)
            if (dto.Prompt != null && brief.Prompt != null)
            {
                brief.Prompt.Theme = dto.Prompt.Theme ?? brief.Prompt.Theme;
                brief.Prompt.Constraint = dto.Prompt.Constraint ?? brief.Prompt.Constraint;
                brief.Prompt.Format = dto.Prompt.Format ?? brief.Prompt.Format;
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Brief updated", brief });
        }

        [HttpPost("regenerate-field")]
        public IActionResult RegenerateField([FromBody] RegenerateBriefFieldInput req)
        {
            // Tu adaptes selon ta logique métier
            object? value = req.Field switch
            {
                "title" => _briefService.GenerateTitle(req.Prompt),
                "objective" => _briefService.GenerateObjective(req.Prompt),
                "audience" => _briefService.GenerateAudience(req.Prompt),
                "platform" => _briefService.GeneratePlatform(req.Prompt),
                _ => null
            };
            if (value == null)
                return BadRequest("Invalid field.");
            return Ok(new { value });
        }
    }
}

public class RegenerateBriefFieldInput
{
    public string Field { get; set; }
    public Prompt Prompt { get; set; }
}