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
        private readonly JsonSerializerOptions _json;

        public AiController(IHttpClientFactory factory)
        {
            _http = factory.CreateClient();
            _http.Timeout = TimeSpan.FromSeconds(60);
            _json = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] PromptDto dto, CancellationToken ct)
        {
            // 1) Call your Python/Ollama service
            var body = JsonSerializer.Serialize(new { prompt = dto.Prompt ?? "" });
            using var content = new StringContent(body, Encoding.UTF8, "application/json");

            using var resp = await _http.PostAsync("http://localhost:8001/generate", content, ct);
            var raw = await resp.Content.ReadAsStringAsync(ct);

            if (!resp.IsSuccessStatusCode)
            {
                // Propagate the backend error payload for debugging
                return StatusCode((int)resp.StatusCode, new { error = raw });
            }

            // 2) Try to parse "raw" and extract a final JSON object produced by the model
            //    We accept 3 shapes:
            //    A) Already { idea, brief }
            //    B) { theme, format, contrainte }  (legacy)
            //    C) Streaming envelope with { response, done, fullPrompt: "<ndjson lines>" }
            try
            {
                using var doc = JsonDocument.Parse(raw);
                var root = doc.RootElement;

                // --- A) Already in desired shape { idea, brief }
                if (root.TryGetProperty("idea", out var ideaEl) &&
                    root.TryGetProperty("brief", out var briefEl))
                {
                    return Ok(new AiResultDto
                    {
                        Idea = ideaEl.GetString() ?? "",
                        Brief = briefEl.GetString() ?? ""
                    });
                }

                // --- B) Flat legacy object
                var fromLegacy = MapLegacyFlat(root);
                if (fromLegacy is not null)
                    return Ok(fromLegacy);

                // --- C) Streaming envelope (Ollama-like)
                if (root.TryGetProperty("fullPrompt", out var fullPromptEl))
                {
                    var reconstructedJson = ReconstructJsonFromStreaming(root, fullPromptEl);
                    if (!string.IsNullOrWhiteSpace(reconstructedJson))
                    {
                        // Try to parse the reconstructed JSON text
                        using var inner = JsonDocument.Parse(reconstructedJson);
                        var mapped = MapAnyToResult(inner.RootElement);
                        if (mapped is not null) return Ok(mapped);
                    }
                }

                // If none of the above matched, last attempt: map the root as "any"
                var fallbackMapped = MapAnyToResult(root);
                if (fallbackMapped is not null) return Ok(fallbackMapped);

                // Absolute fallback: dump raw into "brief" for visibility
                return Ok(new AiResultDto
                {
                    Idea = "Idée générée",
                    Brief = raw
                });
            }
            catch
            {
                // If top-level wasn't valid JSON, return it as brief
                return Ok(new AiResultDto
                {
                    Idea = "Idée générée",
                    Brief = raw
                });
            }
        }

        // --- Helpers ---------------------------------------------------------

        // Maps typical legacy shapes to { idea, brief }
        private static AiResultDto? MapAnyToResult(JsonElement el)
        {
            // Direct shape { idea, brief }
            if (el.ValueKind == JsonValueKind.Object)
            {
                string idea = "";
                string brief = "";

                if (el.TryGetProperty("idea", out var ie)) idea = ie.GetString() ?? "";
                if (el.TryGetProperty("brief", out var be)) brief = be.GetString() ?? "";

                // Legacy names
                if (string.IsNullOrWhiteSpace(idea))
                {
                    if (el.TryGetProperty("theme", out var th)) idea = th.GetString() ?? "";
                }
                if (string.IsNullOrWhiteSpace(brief))
                {
                    if (el.TryGetProperty("contrainte", out var co)) brief = co.GetString() ?? "";
                    else if (el.TryGetProperty("constraint", out var co2)) brief = co2.GetString() ?? "";
                    else if (el.TryGetProperty("fullPrompt", out var fp)) brief = fp.GetString() ?? "";
                }

                if (!string.IsNullOrWhiteSpace(idea) || !string.IsNullOrWhiteSpace(brief))
                    return new AiResultDto { Idea = idea, Brief = brief };
            }
            return null;
        }

        private static AiResultDto? MapLegacyFlat(JsonElement root)
        {
            if (root.ValueKind != JsonValueKind.Object) return null;

            var hasTheme = root.TryGetProperty("theme", out var th);
            var hasConstr = root.TryGetProperty("contrainte", out var co);

            if (!hasTheme && !hasConstr) return null;

            return new AiResultDto
            {
                Idea = hasTheme ? th.GetString() ?? "" : "",
                Brief = hasConstr ? co.GetString() ?? "" : ""
            };
        }

        // Rebuilds the final JSON text from an Ollama-like streaming envelope:
        // - root["response"] contains the very first chunk (often "{\n")
        // - root["fullPrompt"] is a newline-delimited list of JSON rows, each with a "response" fragment
        private static string ReconstructJsonFromStreaming(JsonElement root, JsonElement fullPromptEl)
        {
            var sb = new StringBuilder(1024);

            // First chunk at the top-level "response"
            if (root.TryGetProperty("response", out var firstResp) && firstResp.ValueKind == JsonValueKind.String)
            {
                sb.Append(firstResp.GetString());
            }

            // Then iterate NDJSON lines in fullPrompt, append each "response"
            var fullPrompt = fullPromptEl.GetString() ?? "";
            using var reader = new StringReader(fullPrompt);

            string? line;
            while ((line = reader.ReadLine()) is not null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;

                try
                {
                    using var chunk = JsonDocument.Parse(line);
                    if (chunk.RootElement.TryGetProperty("response", out var r) &&
                        r.ValueKind == JsonValueKind.String)
                    {
                        // System.Text.Json returns unescaped content for string values,
                        // so concatenating yields the real JSON text (e.g. {"theme":"...","brief":"..."})
                        sb.Append(r.GetString());
                    }
                }
                catch
                {
                    // Ignore malformed line and continue
                    continue;
                }
            }

            var text = sb.ToString().Trim();
            // A minimal sanity check: must look like a JSON object
            if (text.StartsWith("{") && text.EndsWith("}")) return text;

            return string.Empty;
        }
    }
}