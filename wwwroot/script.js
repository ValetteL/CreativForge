async function generatePrompt() {
  const res = await fetch('/api/brief/from-prompt');
  const data = await res.json();

  const planner = await fetch('/api/planner/' + encodeURIComponent(data.titre));
  const planning = await planner.json();

  const html = `
    <h2>📄 Brief</h2>
    <p><strong>Titre :</strong> ${data.titre}</p>
    <p><strong>Objectif :</strong> ${data.objectif}</p>
    <p><strong>Cible :</strong> ${data.cible}</p>

    <h2>🗓️ Planification</h2>
    <ul>${planning.étapes.map(e => `<li>${e}</li>`).join("")}</ul>
  `;

  document.getElementById('result').innerHTML = html;
}
