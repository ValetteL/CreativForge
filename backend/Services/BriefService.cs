using CreativForge.Models;

namespace CreativForge.Services
{
    /// <summary>
    /// Business logic for generating creative briefs and their fields.
    /// </summary>
    public class BriefService
    {
        // Generates a new brief from a given prompt.
        public Brief GenerateBriefFromPrompt(Prompt prompt)
        {
            return new Brief
            {
                Title = GenerateTitle(prompt),
                Objective = GenerateObjective(prompt),
                Audience = GenerateAudience(prompt),
                Platform = GeneratePlatform(prompt)
            };
        }

        // Generates only the title based on the prompt.
        public string GenerateTitle(Prompt prompt)
        {
            return $"{prompt.Format} - {prompt.Theme}";
        }

        // Generates the objective field.
        public string GenerateObjective(Prompt prompt)
        {
            return "Deliver an original concept under creative constraints";
        }

        // Generates the audience field.
        public string GenerateAudience(Prompt prompt)
        {
            return "Creative individuals or professionals";
        }

        // Generates the platform field.
        public string GeneratePlatform(Prompt prompt)
        {
            return prompt.Format != null && prompt.Format.Contains("app") ? "Mobile" : "Web/Print";
        }
    }
}
