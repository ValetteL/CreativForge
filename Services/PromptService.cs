using CreativForge.Models;

namespace CreativForge.Services
{
    public class PromptService
    {
        private readonly Random _random = new();

        private readonly string[] Themes = { "Sci-fi", "Fantasy", "Post-apocalyptic", "Slice of life" };
        private readonly string[] Constraints = { "No dialogue", "Time limit", "Inverted narrative" };
        private readonly string[] Formats = { "Comic", "Short film", "Mobile app", "Mini-game" };

        public string GenerateTheme() => Pick(Themes);
        public string GenerateConstraint() => Pick(Constraints);
        public string GenerateFormat() => Pick(Formats);

        public Prompt GeneratePrompt(string? userTheme = null)
        {
            // If a theme is provided, use it; otherwise, pick a random one
            var theme = !string.IsNullOrWhiteSpace(userTheme) ? userTheme : Pick(Themes);
            var constraint = Pick(Constraints);
            var format = Pick(Formats);

            return new Prompt
            {
                Theme = theme,
                Constraint = constraint,
                Format = format,
                FullPrompt = $"{format} about {theme}, with constraint: {constraint}"
            };
        }


        private string Pick(string[] array) => array[_random.Next(array.Length)];
    }
}
