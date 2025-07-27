// Helper to compute the fullPrompt string from a Prompt object.
export function computeFullPrompt(prompt) {
  if (!prompt) return "";
  return `${prompt.format} about ${prompt.theme}, with constraint: ${prompt.constraint}`;
}