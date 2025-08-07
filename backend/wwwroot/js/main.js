let currentPrompt = null;

fetch("/mesbriefs")
  .then(res => {
    if (!res.ok) throw new Error();
    document.getElementById("auth-link").innerHTML = `<a href="/logout">Se déconnecter</a>`;
  })
  .catch(() => {
    document.getElementById("auth-link").innerHTML = `<a href="/login">Connexion</a>`;
  });

function generatePrompt() {
  fetch("/generate-prompt")
    .then(res => res.json())
    .then(prompt => {
      currentPrompt = prompt;
      document.getElementById("prompt-result").textContent = prompt.title;
      document.getElementById("save-section").classList.remove("hidden");
    });
}

function savePrompt() {
  if (!currentPrompt) return;

  fetch("/brief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentPrompt)
  })
    .then(res => {
      if (res.ok) {
        alert("Brief sauvegardé !");
        location.reload(); // recharge pour voir dans la liste
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    });
}

async function generatePrompt() {
  const res = await fetch('/api/brief/from-prompt');
  const data = await res.json();

  const planner = await fetch('/api/planner/' + encodeURIComponent(data.title));
  const planning = await planner.json();

  const html = `
    <h2>📄 Brief</h2>
    <p><strong>Titre :</strong> ${data.title}</p>
    <p><strong>Objectif :</strong> ${data.objective}</p>
    <p><strong>Cible :</strong> ${data.audience}</p>

    <h2>🗓️ Planification</h2>
    <ul>${planning.tasks.map(e => `<li>${e}</li>`).join("")}</ul>
  `;

  document.getElementById('prompt-result').innerHTML = html;
}
