using Microsoft.AspNetCore.Mvc;
using CreativForge.Services;
using CreativForge.Models;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BriefController : ControllerBase
    {
        private readonly BriefService _briefService;
        private readonly PromptService _promptService;

        public BriefController(BriefService briefService, PromptService promptService)
        {
            _briefService = briefService;
            _promptService = promptService;
        }

        [HttpGet("from-prompt")]
        public ActionResult<Brief> GenerateBriefFromPrompt()
        {
            var prompt = _promptService.GeneratePrompt();
            var brief = _briefService.CreateBriefFromPrompt(prompt);
            return Ok(brief);
        }
    }
}
