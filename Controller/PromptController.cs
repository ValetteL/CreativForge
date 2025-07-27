using CreativForge.Services;
using Microsoft.AspNetCore.Mvc;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptController : ControllerBase
    {
        private readonly PromptService _promptService;

        public PromptController(PromptService promptService)
        {
            _promptService = promptService;
        }

        /// <summary>
        /// Génère un prompt complet (POST /api/prompt)
        /// </summary>
        [HttpPost]
        public IActionResult GeneratePrompt([FromBody] PromptInput input)
        {
            var prompt = _promptService.GeneratePrompt(input?.Theme); // Theme optionnel
            if (prompt == null)
                return BadRequest("Generation failed.");
            return Ok(new { prompt });
        }

        /// <summary>
        /// Régénère un champ spécifique du prompt (POST /api/prompt/regenerate-field)
        /// </summary>
        [HttpPost("regenerate-field")]
        public IActionResult RegenerateField([FromBody] RegenerateFieldInput req)
        {
            object? value = req.Field switch
            {
                "theme" => _promptService.GenerateTheme(),
                "constraint" => _promptService.GenerateConstraint(),
                "format" => _promptService.GenerateFormat(),
                "all" => _promptService.GeneratePrompt(),
                _ => null
            };
            if (value == null)
                return BadRequest("Invalid field.");
            return Ok(new { value });
        }
    }

    public class PromptInput
    {
        public string? Theme { get; set; }
    }
    public class RegenerateFieldInput
    {
        public string Field { get; set; }
    }
}
