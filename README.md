# CreativForge

**CreativForge** Plateforme de génération d'idées créatifs augmentée par IA (Ollama + Llama3, stack full-stack .NET + React + FastAPI/Python) avec export PDF

🚧 **Projet WIP** – l’interface et les fonctionnalités sont en cours de développement.

---

## Architecture 
- **Frontend** : React (Node.js) - `/frontend`
- **Backend** : ASP.NET Core WebAPI - `/backend`
- **AI Service** : FastAPI (Python 3.10+) - `/ai`
- **LLM** : Ollama (Llama3 ou autre modèle local)
- **Database** : SQLite (EF Core)

---

## 📌 Fonctionnalités principales

- 🎲 Générateur de prompts créatifs/granulaire
- 📅 Planification d’objectifs ou d’étapes
- 📝 Génération de briefs et export au format PDF
- 📂 Architecture modulaire ASP.NET MVC (Controllers, Services, Models)

---

## 🐳 Lancement rapide (Docker WIP)

> Nécessite : [Docker Desktop](https://www.docker.com/products/docker-desktop/)  
> Installer Ollama localement *ou* laisser Docker gérer si le service est inclus dans `docker-compose.yml`.
> docker-compose up --build à la racine du projet

Frontend sur http://localhost:3000

Backend sur http://localhost:5006

FastAPI (AI) sur http://localhost:8001

Ollama sur http://localhost:11434

---

## 🚀 Lancer le projet localement

### 1. Configurer les variables sensibles (backend)

- Créer un fichier `appSettings.*.json` dans `/backend` avec les clés suivantes (jamais de commit!) :
  JWT_SECRET=*********
  GOOGLE_CLIENT_ID=********.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=********

### 2.

ollama : 

ollama pull llama3
ollama serve

/ai : 

cd ai
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

/backend : 

dotnet restore
dotnet ef database update
dotnet run

/frontend :

cd frontend
npm install
npm run dev

---

## Prochaines améliorations
- Interface utilisateur stylisée
- Sélection/édition granulaire des prompts/briefs via l’UI React
- Requête IA plus personnalisable
- Auth Google plus robuste/production-ready
- CI/CD, monitoring, etc.
- Génération de planning détaillé

📄 Licence
Ce projet est distribué sous licence MIT.
Créé par ValetteL.


