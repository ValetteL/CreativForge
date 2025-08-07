using CreativForge.Services;
using CreativForge.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PlanningController : ControllerBase
{
    private readonly PlannerService _plannerService;
    public PlanningController(PlannerService plannerService)
    {
        _plannerService = plannerService;
    }

    [HttpGet("generate")]
    public IActionResult GeneratePlan([FromQuery] string projectName)
    {
        var planning = _plannerService.GeneratePlan(projectName);
        return Ok(planning);
    }
}
