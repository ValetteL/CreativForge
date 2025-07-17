using Microsoft.AspNetCore.Mvc;
using CreativForge.Pdf;
using CreativForge.Services;
using CreativForge.Models;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExportController : ControllerBase
    {
        private readonly PdfExporter _exporter;
        private readonly BriefService _briefService;
        private readonly PlannerService _plannerService;

        public ExportController(PdfExporter exporter, BriefService brief, PlannerService planner)
        {
            _exporter = exporter;
            _briefService = brief;
            _plannerService = planner;
        }

        [HttpGet("brief/pdf")]
        public IActionResult GetBriefPdf()
        {
            var prompt = new PromptService().GeneratePrompt();
            var brief = _briefService.CreateBriefFromPrompt(prompt);
            var pdfBytes = _exporter.ExportBriefToPdf(brief);
            return File(pdfBytes, "application/pdf", "creative-brief.pdf");
        }

        [HttpGet("plan/pdf")]
        public IActionResult GetPlanPdf(string name = "My Project")
        {
            var plan = _plannerService.GeneratePlan(name);
            var pdfBytes = _exporter.ExportPlanToPdf(plan);
            return File(pdfBytes, "application/pdf", "project-plan.pdf");
        }
    }
}
