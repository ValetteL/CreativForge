namespace CreativForge.Models
{
    public class Prompt
    {
        public int Id { get; set; }
        public string Theme { get; set; }
        public string Constraint { get; set; }
        public string Format { get; set; }
        public ICollection<Brief> Briefs { get; set; } = new List<Brief>();
        public string FullPrompt => $"{Format} about {Theme}, with constraint: {Constraint}";
    }
}
