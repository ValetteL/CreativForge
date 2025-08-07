import json
import re
import requests
from fastapi import FastAPI, Body, HTTPException

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate" # change to ollama:11434 if using Docker

def extract_json_from_text(text):
    """Extract the first valid JSON object in a string"""
    try:
        # take first match of JSON-like structure
        match = re.search(r'(\{.*?\}|\[.*?\])', text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
    except Exception as e:
        pass
    return None

def build_prompt(prompt):
    return ("Generate a creative project idea in perfect JSON format, "
            "with keys: theme, format, contrainte. "
            "Example: {\"theme\": \"Voyage\", \"format\": \"Podcast\", \"contrainte\": \"Invité mystère\"} "
            "NO commentary, NO markdown, JSON only."
            f"\nBase idea : {prompt or 'any'}")

@app.post("/generate")
def generate(prompt: str = Body(..., embed=True)):
    prompt = build_prompt(prompt)
    response = requests.post(OLLAMA_URL, json={
        "model": "llama3",
        "prompt": prompt
    }, timeout=120)
    # always text response
    txt = response.text
    # try to extract JSON from the response text :
    data = extract_json_from_text(txt)
    if not data:
        # Fallback : empty data if no JSON found
        data = {"theme": "", "format": "", "contrainte": "", "prompt": txt}
    # for frontend compatibility, always return fullPrompt
    data["fullPrompt"] = txt
    return data

#def parse_streaming_json(resp):
#    result = ""
#    for line in resp.iter_lines():
#        if line:
#            obj = json.loads(line)
#            result += obj.get("response", "")
#    return result

#@app.post("/generate")
#def generate(prompt: str = Body(..., embed=True)):
#    response = requests.post(OLLAMA_URL, json={
#        "model": "llama3",
#        "prompt": prompt,
#        "stream": True
#    }, stream=True, timeout=120)
#    response.raise_for_status()
#    result = parse_streaming_json(response)
#    return {"result": result}