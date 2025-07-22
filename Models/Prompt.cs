namespace CreativForge.Models
{
    public class Prompt
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Theme { get; set; }
        public string Constraint { get; set; }
        public string Format { get; set; }
        public string FullPrompt => $"{Format} about {Theme}, with constraint: {Constraint}";
    }
}
