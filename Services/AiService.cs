using System.Text;
using CreativForge.Models;

namespace CreativForge.Services
{
    public class AiService
    {
        private readonly HttpClient _http;

        public AiService()
        {
            _http = new HttpClient();
        }

        public async Task<string> GeneratePromptAsync(string userPrompt)
        {
            var body = new { theme = userPrompt };
            var content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );
            var response = await _http.PostAsync("http://localhost:8000/generate", content);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            // Tu peux parser le JSON ici si tu veux aller plus loin
            return result;
        }
    }
}