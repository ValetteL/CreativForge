# CreativForge

**CreativForge** est une application web ASP.NET Core créative.  
Elle permet de générer des prompts créatifs, de planifier des projets, et d’exporter des briefs en PDF.

🚧 **Projet WIP** – l’interface et les fonctionnalités sont en cours de développement.

---

## 📌 Fonctionnalités principales

- 🎲 Générateur de prompts créatifs
- 📅 Planification d’objectifs ou d’étapes
- 📝 Génération de briefs au format PDF
- 📂 Architecture modulaire ASP.NET MVC (Controllers, Services, Models)
- 📦 Export PDF avec [QuestPDF](https://github.com/QuestPDF/QuestPDF)
- 🌐 API REST prête à l’emploi (Swagger intégré)

---

## 🚀 Lancer le projet localement

dotnet restore
dotnet build
dotnet run

Ouvrir dans un navigateur :

Interface : http://localhost:5000/index.html
Swagger API : http://localhost:5000/swagger
Export PDF : http://localhost:5000/api/export/brief/pdf

# 🛡️ Sécurité & Configuration (Backend et Frontend)

## Backend .NET

- Copiez `appsettings.Development.json.example` en `appsettings.Development.json` pour votre usage local.

## Prochaines améliorations
- Interface utilisateur stylisée
- Ajout d’une base de données (MongoDB / EF Core)
- Authentification simple
- Sauvegarde des briefs
- Génération de planning détaillé

📄 Licence
Ce projet est distribué sous licence MIT.
Créé par ValetteL.


