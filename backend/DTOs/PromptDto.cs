using System.Text.Json.Serialization;

namespace CreativForge.DTOs
{
    public class PromptDto
    {
        public string? Theme { get; set; }
        public string? Constraint { get; set; }
        public string? Format { get; set; }
        [JsonPropertyName("prompt")]
        public string? Prompt { get; set; }
    }
}
