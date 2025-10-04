# Script PowerShell pour démarrer le serveur backend
Write-Host "🚀 Démarrage du serveur Koula E-commerce..." -ForegroundColor Green

# Vérifier qu'on est dans le bon répertoire
if (!(Test-Path "server/package.json")) {
    Write-Host "❌ Erreur: package.json introuvable dans le dossier server" -ForegroundColor Red
    Write-Host "💡 Assurez-vous d'être dans le répertoire principal du projet" -ForegroundColor Yellow
    exit 1
}

# Aller dans le répertoire server
Set-Location "server"

Write-Host "📂 Répertoire: $(Get-Location)" -ForegroundColor Blue

# Vérifier les dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
npm install

# Démarrer le serveur
Write-Host "🌐 Démarrage du serveur sur le port 3001..." -ForegroundColor Green
Write-Host "🔗 Une fois démarré, testez: http://localhost:3001/api/health" -ForegroundColor Cyan

npm start
