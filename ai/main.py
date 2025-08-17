import json
import re
from typing import Any, Dict, Optional

import requests
from fastapi import FastAPI, Body, HTTPException

app = FastAPI()

# Change to "http://ollama:11434/api/generate" if you run via Docker compose
OLLAMA_URL = "http://localhost:11434/api/generate"

# ---------- Prompting ----------

def build_prompt(user_prompt: Optional[str]) -> str:
    """
    Ask for a French response, strict JSON only, two keys: idea, brief.
    Keep it simple so the model can't "wander".
    """
    base = user_prompt or "idée libre"
    return (
        "Réponds uniquement en français.\n"
        "Retourne STRICTEMENT un JSON valide, SANS commentaire ni markdown, "
        "avec exactement ces clés et rien d'autre:\n"
        "{ \"idea\": string, \"brief\": string }\n"
        "Exemple: {\"idea\": \"Série de micro-documentaires...\", \"brief\": \"Un format court...\"}\n"
        f"Entrée utilisateur: {base}"
    )

# ---------- Parsing helpers ----------

JSON_SNIPPET = re.compile(r'(\{.*\}|\[.*\])', re.DOTALL)

def extract_first_json(text: str) -> Optional[Any]:
    """
    Try to parse the first JSON-looking snippet from raw text.
    Useful when the model wraps JSON with extra prose.
    """
    try:
        m = JSON_SNIPPET.search(text)
        if not m:
            return None
        return json.loads(m.group(1))
    except Exception:
        return None

def map_to_idea_brief(obj: Any) -> Optional[Dict[str, str]]:
    """
    Accepts multiple shapes and returns {"idea": "...", "brief": "..."} or None.
    Shapes handled:
      A) {"idea": "...", "brief": "..."}
      B) legacy {"theme": "...", "format": "...", "contrainte": "..."}
      C) flat text -> brief only
    """
    if not isinstance(obj, dict):
        return None

    # New shape (preferred)
    idea = obj.get("idea") or obj.get("Idea")
    brief = obj.get("brief") or obj.get("Brief")

    if isinstance(idea, str) and isinstance(brief, str):
        return {"idea": idea.strip(), "brief": brief.strip()}

    # Legacy: theme/format/contrainte -> idea = "theme · format", brief = contrainte
    theme = obj.get("theme") or obj.get("Theme")
    fmt = obj.get("format") or obj.get("Format")
    contrainte = obj.get("contrainte") or obj.get("constraint") or obj.get("Contrainte")

    idea_parts = [p for p in [theme, fmt] if isinstance(p, str) and p.strip()]
    if idea_parts or (isinstance(contrainte, str) and contrainte.strip()):
        idea_str = " · ".join(idea_parts).strip()
        brief_str = (contrainte or "").strip()
        return {"idea": idea_str, "brief": brief_str}

    # Fallback: if there's a 'text' or 'content' string, use it as brief
    text_like = obj.get("text") or obj.get("content")
    if isinstance(text_like, str) and text_like.strip():
        return {"idea": "", "brief": text_like.strip()}

    return None

# ---------- API ----------

@app.post("/generate")
def generate(prompt: str = Body(..., embed=True)):
    """
    Calls Ollama (non-stream) and returns a strict {idea, brief}.
    We send format="json" to strongly bias valid JSON output.
    """
    payload = {
        "model": "llama3",
        "prompt": build_prompt(prompt),
        # format="json" makes Ollama validate the output as JSON (when supported).
        "format": "json",
        "stream": False,
        # You can tune temperature/top_p if you want more/less creativity:
        # "options": {"temperature": 0.7, "top_p": 0.9}
    }

    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=120)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Ollama not reachable: {e}")

    if r.status_code // 100 != 2:
        # Propagate the error body if any
        raise HTTPException(status_code=r.status_code, detail=r.text)

    # Ollama (non-stream) typically returns a JSON with "response" string inside.
    # Example:
    # {
    #   "model": "llama3",
    #   "created_at": "...",
    #   "response": "{\"idea\":\"...\",\"brief\":\"...\"}",
    #   "done": true
    # }
    try:
        outer = r.json()
    except ValueError:
        # If the server didn't send JSON (shouldn't happen with format=json), try recovery
        obj = extract_first_json(r.text) or {"brief": r.text}
        mapped = map_to_idea_brief(obj) or {"idea": "Idée générée", "brief": r.text}
        return mapped

    # Happy path: parse the "response" field (should be the actual JSON we want)
    resp_text = outer.get("response")
    if isinstance(resp_text, str) and resp_text.strip():
        inner = None
        try:
            inner = json.loads(resp_text)
        except ValueError:
            # Try to salvage if it's not pure JSON
            inner = extract_first_json(resp_text)

        if isinstance(inner, dict):
            mapped = map_to_idea_brief(inner)
            if mapped:
                return mapped

    # If "response" missing or not parseable, attempt to map the outer object directly
    mapped_outer = map_to_idea_brief(outer)
    if mapped_outer:
        return mapped_outer

    # Final fallback: return the raw response text as brief
    return {"idea": "Idée générée", "brief": resp_text or r.text}