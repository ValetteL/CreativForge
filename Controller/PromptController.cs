using Microsoft.AspNetCore.Mvc;
using CreativForge.Services;
using CreativForge.Models;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromptController : ControllerBase
    {
        private readonly PromptService _service;

        public PromptController(PromptService service) => _service = service;

        [HttpGet]
        public ActionResult<Prompt> Get() => Ok(_service.GeneratePrompt());
    }
}
