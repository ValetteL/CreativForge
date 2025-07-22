using Microsoft.AspNetCore.Mvc;
using CreativForge.Pdf;
using CreativForge.Services;
using CreativForge.Models;
using CreativForge.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly PdfExporter _exporter;
        private readonly AppDbContext _db;
        private readonly PlannerService _plannerService;

        public ExportController(PdfExporter exporter, AppDbContext db, PlannerService planner)
        {
            _exporter = exporter;
            _db = db;
            _plannerService = planner;
        }

        [Authorize]
        [HttpGet("brief/pdf/{id}")]
        public async Task<IActionResult> GetBriefPdf(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var brief = await _db.Briefs.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (brief == null) return NotFound("Brief not found or not yours");

            var pdfBytes = _exporter.ExportBriefToPdf(brief);
            var filename = $"creative-brief-{brief.Id}.pdf";
            return File(pdfBytes, "application/pdf", filename);
        }

        [Authorize]
        [HttpGet("plan/pdf/{briefId}")]
        public async Task<IActionResult> GetPlanPdf(int briefId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var brief = await _db.Briefs.FirstOrDefaultAsync(b => b.Id == briefId && b.UserId == userId);
            if (brief == null) return NotFound("Brief not found or not yours");

            // Ici, tu peux choisir comment générer le plan (par exemple à partir du titre du brief)
            var plan = _plannerService.GeneratePlan(brief.Title ?? "My Project");
            var pdfBytes = _exporter.ExportPlanToPdf(plan);
            var filename = $"project-plan-{brief.Id}.pdf";
            return File(pdfBytes, "application/pdf", filename);
        }
    }
}
