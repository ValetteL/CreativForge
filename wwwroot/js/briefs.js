fetch("/mesbriefs")
  .then(res => res.json())
  .then(briefs => {
    const list = document.getElementById("brief-list");
    briefs.forEach(b => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${b.title}</strong> (${b.platform})<br>
        <a href="/edit.html?id=${b.id}">✏️ Modifier</a> |
        <a href="#" onclick="deleteBrief(${b.id})">🗑️ Supprimer</a>
      `;
      list.appendChild(li);
    });
  });

function deleteBrief(id) {
  if (confirm("Supprimer ce brief ?")) {
    fetch(`/brief/${id}`, { method: "DELETE" })
      .then(() => location.reload());
  }
}