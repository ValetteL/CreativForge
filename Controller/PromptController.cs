using Microsoft.AspNetCore.Mvc;
using CreativForge.Services;
using CreativForge.Models;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptController : ControllerBase
    {
        // Dependency-injected services
        private readonly PromptService _promptService;
        private readonly BriefService _briefService;

        // Constructor: inject both services
        public PromptController(PromptService promptService, BriefService briefService)
        {
            _promptService = promptService;
            _briefService = briefService;
        }

        /// <summary>
        /// Generate a creative prompt and a matching brief.
        /// Expects (optionally) a user input in the body.
        /// </summary>
        [HttpPost("generate")]
        public IActionResult GeneratePrompt([FromBody] PromptInput input)
        {
            // Generate a random or custom prompt
            var prompt = _promptService.GeneratePrompt();

            // Create a brief based on the generated prompt
            var brief = _briefService.CreateBriefFromPrompt(prompt);

            // Return both prompt and brief as JSON
            return Ok(new { prompt, brief });
        }
    }
}
