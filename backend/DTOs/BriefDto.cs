namespace CreativForge.DTOs
{
    public class BriefDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Objective { get; set; }
        public string Audience { get; set; }
        public string Platform { get; set; }
        public PromptDto Prompt { get; set; }
    }
}
