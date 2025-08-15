// Helper to compute the fullPrompt string from a Prompt object.
export function computeFullPrompt(prompt) {
  if (!prompt) return "";
  return `${prompt.format} about ${prompt.theme}, with constraint: ${prompt.constraint}`;
}

export function parseFullPromptNDJSON(fullPrompt) {
  try {
    if (!fullPrompt || typeof fullPrompt !== "string") {
      return { ok: false, error: "empty fullPrompt" };
    }

    // Split NDJSON lines, ignore empty ones
    var lines = fullPrompt.split(/\r?\n/).filter(Boolean);

    // Collect only the `response` pieces
    var pieces = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      try {
        var obj = JSON.parse(line);
        if (obj && typeof obj.response === "string") {
          pieces.push(obj.response);
        }
      } catch (e) {
        // tolerate any non-JSON line
      }
    }

    // Joined is a JSON *string literal*, e.g. "{\"theme\":\"...\",\"format\":\"...\"}"
    var joined = pieces.join("");

    // First parse: turns the JSON string literal into a normal string: '{ "theme": ... }'
    var inner = joined;
    try {
      inner = JSON.parse(joined);
    } catch (e) {
      // Sometimes the stream might already be a plain JSON string. Keep `joined` as-is.
    }

    // If after first parse we still have a string, second parse to get the final object
    var finalObj = inner;
    if (typeof inner === "string") {
      finalObj = JSON.parse(inner);
    }

    // Shape guard + defaults
    var data = {
      theme: finalObj && typeof finalObj.theme === "string" ? finalObj.theme : "",
      format: finalObj && typeof finalObj.format === "string" ? finalObj.format : "",
      contrainte: finalObj && typeof finalObj.contrainte === "string" ? finalObj.contrainte : "",
    };

    return {
      ok: true,
      data: data,
      text: typeof inner === "string" ? inner : JSON.stringify(finalObj)
    };
  } catch (err) {
    return { ok: false, error: (err && err.message) || "parse error" };
  }
}

// Normalizes /api/ai/generate response to a consistent shape for the UI.
export function normalizeGenerate(data) {
  // Already in the desired envelope
  if (data && data.prompt) {
    var p = data.prompt;
    return {
      prompt: {
        theme: p.theme != null ? p.theme : "",
        format: p.format != null ? p.format : "",
        contrainte: p.contrainte != null ? p.contrainte : "",
        fullPrompt: p.fullPrompt != null ? p.fullPrompt : "",
      },
      brief: data.brief != null ? data.brief : null,
    };
  }

  // If backend returned top-level fields + fullPrompt NDJSON
  if (data && typeof data.fullPrompt === "string") {
    var parsed = parseFullPromptNDJSON(data.fullPrompt);
    var base = parsed.ok ? parsed.data : { theme: "", format: "", contrainte: "" };

    return {
      prompt: {
        theme: base.theme,
        format: base.format,
        contrainte: base.contrainte,
        // keep the raw/parsed text for debugging or re-use
        fullPrompt: parsed.ok ? (parsed.text || "") : data.fullPrompt,
      },
      brief: data.brief != null ? data.brief : null,
    };
  }

  // Last resort: try to read simple flat fields
  return {
    prompt: {
      theme: (data && data.theme) || "",
      format: (data && data.format) || "",
      contrainte: (data && data.contrainte) || "",
      fullPrompt: (data && (data.text || data.content)) || "",
    },
    brief: (data && data.brief) || null,
  };
}