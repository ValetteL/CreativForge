# Étape 1 : build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copier csproj et restaurer les dépendances
COPY *.csproj ./
RUN dotnet restore

# Copier tout le reste et compiler
COPY . ./
RUN dotnet publish -c Release -o out

# Étape 2 : runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Expose le port 80
EXPOSE 80

# Commande de démarrage
ENTRYPOINT ["dotnet", "CreativForge.dll"]
