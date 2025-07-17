FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SkiNet.sln","./"]
COPY ["API/","API/"]
COPY ["Core/","Core/"]
COPY ["Infrastructure/","Infrastructure/"]
WORKDIR /src/API
RUN dotnet restore "API.csproj"
RUN dotnet publish -c Release -o /app/publish
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet","API.dll"]
