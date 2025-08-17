using System.Text.Json.Serialization;

namespace CreativForge.DTOs
{
    public class PromptDto
    {
        [JsonPropertyName("prompt")]
        public string? Prompt { get; set; }
    }
}
