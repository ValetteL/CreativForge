namespace CreativForge.DTOs
{
    public class RegenerateFieldRequest
    {
        public string Field { get; set; } // ex: "theme", "constraint", "format", "all"
        public PromptDto Current { get; set; }
    }
}
