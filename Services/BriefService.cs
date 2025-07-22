using CreativForge.Models;

namespace CreativForge.Services
{
    public class BriefService
    {
        public Brief CreateBriefFromPrompt(Prompt prompt)
        {
            return new Brief
            {
                Title = $"{prompt.Format} - {prompt.Theme}",
                Objective = "Deliver an original concept under creative constraints",
                Audience = "Creative individuals or professionals",
                Platform = prompt.Format.Contains("app") ? "Mobile" : "Web/Print"
            };
        }
    }
}
