using CreativForge.Models;

namespace CreativForge.Services
{
    public class PromptService
    {
        private readonly Random _random = new();

        private readonly string[] Themes = { "Sci-fi", "Fantasy", "Post-apocalyptic", "Slice of life" };
        private readonly string[] Constraints = { "No dialogue", "Time limit", "Inverted narrative" };
        private readonly string[] Formats = { "Comic", "Short film", "Mobile app", "Mini-game" };

        public Prompt GeneratePrompt()
        {
            return new Prompt
            {
                Theme = Pick(Themes),
                Constraint = Pick(Constraints),
                Format = Pick(Formats)
            };
        }

        private string Pick(string[] array) => array[_random.Next(array.Length)];
    }
}
