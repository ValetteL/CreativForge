using CreativForge.Models;

namespace CreativForge.Services
{
    public class PlannerService
    {
        public Planning GeneratePlan(string projectName)
        {
            return new Planning
            {
                ProjectName = projectName,
                Tasks = new List<string>
            {
                "Define goals",
                "Create mockups",
                "Develop MVP",
                "Test and iterate",
                "Deploy or publish"
            }
            };
        }
    }
}
