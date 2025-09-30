# Script de démarrage dynamique pour Koula E-commerce
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   KOULA E-COMMERCE - DEMARRAGE DYNAMIQUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des dépendances
Write-Host "[1/4] Vérification des dépendances..." -ForegroundColor Yellow

if (-not (Test-Path "server\node_modules")) {
    Write-Host "Installation des dépendances serveur..." -ForegroundColor Green
    Set-Location "server"
    npm install
    Set-Location ".."
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "Installation des dépendances client..." -ForegroundColor Green
    Set-Location "client"
    npm install
    Set-Location ".."
}

Write-Host ""

# Configuration des variables d'environnement
Write-Host "[2/4] Configuration des variables d'environnement..." -ForegroundColor Yellow

if (-not (Test-Path "server\.env")) {
    Write-Host "Création du fichier .env pour le serveur..." -ForegroundColor Green
    $envContent = @"
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/koula_ecommerce
JWT_SECRET=koula_super_secret_key_2024_secure
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
"@
    $envContent | Out-File -FilePath "server\.env" -Encoding UTF8
}

Write-Host ""

# Vérification de MongoDB
Write-Host "[3/4] Vérification de MongoDB..." -ForegroundColor Yellow
Write-Host "Veuillez vous assurer que MongoDB est démarré sur votre système" -ForegroundColor White
Write-Host "URL de connexion: mongodb://localhost:27017/koula_ecommerce" -ForegroundColor White
Write-Host ""

# Démarrage des services
Write-Host "[4/4] Démarrage des services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Serveur API: http://localhost:3001" -ForegroundColor Green
Write-Host "Client React: http://localhost:3000" -ForegroundColor Green
Write-Host "Dashboard Dynamique: http://localhost:3000/dashboard-dynamique.html" -ForegroundColor Green
Write-Host ""

# Démarrer le serveur
Write-Host "Démarrage du serveur API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run dev"

# Attendre un peu avant de démarrer le client
Start-Sleep -Seconds 3

# Démarrer le client
Write-Host "Démarrage du client React..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SERVICES DÉMARRÉS AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour tester le dashboard dynamique:" -ForegroundColor White
Write-Host "1. Ouvrez http://localhost:3000/dashboard-dynamique.html" -ForegroundColor White
Write-Host "2. Cliquez sur 'Actualiser les Données'" -ForegroundColor White
Write-Host "3. Testez les fonctionnalités" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
