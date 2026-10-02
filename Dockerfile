FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY IntereactiveView.csproj ./
RUN dotnet restore IntereactiveView.csproj
COPY . .
RUN dotnet build IntereactiveView.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish IntereactiveView.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "IntereactiveView.dll"]
