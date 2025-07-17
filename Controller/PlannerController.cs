using Microsoft.AspNetCore.Mvc;
using CreativForge.Services;
using CreativForge.Models;

namespace CreativForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlannerController : ControllerBase
    {
        private readonly PlannerService _service;

        public PlannerController(PlannerService service) => _service = service;

        [HttpGet("{projectName}")]
        public ActionResult<Planning> GetPlan(string projectName)
        {
            var plan = _service.GeneratePlan(projectName);
            return Ok(plan);
        }
    }
}
