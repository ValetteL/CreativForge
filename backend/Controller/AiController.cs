using System.Net.Http;
using System.Text;
using System.Text.Json;
using CreativForge.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CreativForge.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _http;
        public AiController(IHttpClientFactory factory) { _http = factory.CreateClient(); }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] PromptDto dto)
        {
            var body = JsonSerializer.Serialize(new { prompt = dto.Prompt });
            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var resp = await _http.PostAsync("http://localhost:8001/generate", content);
            string json = await resp.Content.ReadAsStringAsync();

            if (!resp.IsSuccessStatusCode)
            {
                try
                {
                    var err = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
                    return StatusCode((int)resp.StatusCode, err);
                }
                catch
                {
                    return StatusCode((int)resp.StatusCode, new { error = json });
                }
            }

            try
            {
                // Utilise System.Text.Json ou Newtonsoft.Json, selon ce qui est plus tolérant.
                // Ici, on renvoie l'objet tel quel pour que le front reçoive {theme, format, contrainte, fullPrompt}
                var result = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
                return Ok(result);
            }
            catch
            {
                // Au pire, renvoie tout le texte sous "fullPrompt"
                return Ok(new
                {
                    theme = "",
                    format = "",
                    contrainte = "",
                    prompt = json
                });
            }
        }
    }
}
