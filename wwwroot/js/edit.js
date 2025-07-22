const params = new URLSearchParams(location.search);
const id = params.get("id");

fetch(`/brief/${id}`)
  .then(res => res.json())
  .then(b => {
    document.getElementById("title").value = b.title;
    document.getElementById("platform").value = b.platform;
    document.getElementById("objective").value = b.objective;
    document.getElementById("audience").value = b.audience;
  });

document.getElementById("edit-form").addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    platform: document.getElementById("platform").value,
    objective: document.getElementById("objective").value,
    audience: document.getElementById("audience").value
  };

  fetch(`/brief/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => location.href = "/briefs.html");
});
