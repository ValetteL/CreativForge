# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "./CreativForge.csproj"
RUN dotnet publish "./CreativForge.csproj" -c Release -o /out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_URLS=http://+:5006
EXPOSE 5006
CMD ["dotnet", "CreativForge.dll"]