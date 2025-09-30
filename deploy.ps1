# Script de déploiement PowerShell pour Bowoye Multi Services
# Frontend sur Vercel + Backend sur Render

Write-Host "🚀 Déploiement de Bowoye Multi Services" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Fonctions pour les messages colorés
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Vérifier les prérequis
function Test-Prerequisites {
    Write-Info "Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js trouvé : $nodeVersion"
    }
    catch {
        Write-Error "Node.js n'est pas installé"
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm --version
        Write-Success "npm trouvé : $npmVersion"
    }
    catch {
        Write-Error "npm n'est pas installé"
        exit 1
    }
    
    # Vérifier Git
    try {
        $gitVersion = git --version
        Write-Success "Git trouvé : $gitVersion"
    }
    catch {
        Write-Error "Git n'est pas installé"
        exit 1
    }
    
    Write-Success "Tous les prérequis sont installés"
}

# Préparer le backend
function Initialize-Backend {
    Write-Info "Préparation du backend..."
    
    Set-Location server
    
    # Installer les dépendances
    Write-Info "Installation des dépendances du backend..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dépendances backend installées"
    }
    else {
        Write-Error "Erreur lors de l'installation des dépendances backend"
        exit 1
    }
    
    Set-Location ..
}

# Préparer le frontend
function Initialize-Frontend {
    Write-Info "Préparation du frontend..."
    
    Set-Location client
    
    # Installer les dépendances
    Write-Info "Installation des dépendances du frontend..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dépendances frontend installées"
    }
    else {
        Write-Error "Erreur lors de l'installation des dépendances frontend"
        exit 1
    }
    
    # Test de build
    Write-Info "Test de build du frontend..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build frontend réussi"
    }
    else {
        Write-Error "Erreur lors du build frontend"
        exit 1
    }
    
    Set-Location ..
}

# Vérifier les fichiers de configuration
function Test-ConfigFiles {
    Write-Info "Vérification des fichiers de configuration..."
    
    # Vérifier vercel.json
    if (Test-Path "vercel.json") {
        Write-Success "vercel.json trouvé"
    }
    else {
        Write-Warning "vercel.json manquant - sera créé automatiquement"
    }
    
    # Vérifier render.yaml
    if (Test-Path "render.yaml") {
        Write-Success "render.yaml trouvé"
    }
    else {
        Write-Warning "render.yaml manquant - sera créé automatiquement"
    }
    
    # Vérifier package.json
    if (Test-Path "client/package.json") {
        Write-Success "package.json frontend trouvé"
    }
    else {
        Write-Error "package.json frontend manquant"
        exit 1
    }
    
    if (Test-Path "server/package.json") {
        Write-Success "package.json backend trouvé"
    }
    else {
        Write-Error "package.json backend manquant"
        exit 1
    }
}

# Générer les fichiers de configuration manquants
function New-ConfigFiles {
    Write-Info "Génération des fichiers de configuration..."
    
    # Créer vercel.json si manquant
    if (-not (Test-Path "vercel.json")) {
        $vercelConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
'@
        $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
        Write-Success "vercel.json créé"
    }
    
    # Créer render.yaml si manquant
    if (-not (Test-Path "render.yaml")) {
        $renderConfig = @'
services:
  - type: web
    name: bowoye-backend
    env: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && node index.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://bowoye-frontend.vercel.app
'@
        $renderConfig | Out-File -FilePath "render.yaml" -Encoding UTF8
        Write-Success "render.yaml créé"
    }
}

# Instructions pour le déploiement manuel
function Show-DeploymentInstructions {
    Write-Info "Instructions de déploiement..."
    
    Write-Host ""
    Write-Host "📋 ÉTAPES SUIVANTES POUR LE DÉPLOIEMENT :" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 🌐 DÉPLOIEMENT BACKEND (RENDER) :" -ForegroundColor Yellow
    Write-Host "   - Aller sur https://render.com" -ForegroundColor White
    Write-Host "   - Créer un nouveau Web Service" -ForegroundColor White
    Write-Host "   - Connecter votre repository GitHub" -ForegroundColor White
    Write-Host "   - Configurer :" -ForegroundColor White
    Write-Host "     * Build Command: cd server; npm install" -ForegroundColor Gray
    Write-Host "     * Start Command: cd server; node index.js" -ForegroundColor Gray
    Write-Host "     * Environment: Node" -ForegroundColor Gray
    Write-Host "   - Ajouter les variables d'environnement :" -ForegroundColor White
    Write-Host "     * NODE_ENV=production" -ForegroundColor Gray
    Write-Host "     * PORT=10000" -ForegroundColor Gray
    Write-Host "     * MONGODB_URI=votre-mongodb-uri" -ForegroundColor Gray
    Write-Host "     * JWT_SECRET=votre-jwt-secret" -ForegroundColor Gray
    Write-Host "     * CORS_ORIGIN=https://bowoye-frontend.vercel.app" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. 🎨 DÉPLOIEMENT FRONTEND (VERCEL) :" -ForegroundColor Yellow
    Write-Host "   - Aller sur https://vercel.com" -ForegroundColor White
    Write-Host "   - Créer un nouveau projet" -ForegroundColor White
    Write-Host "   - Connecter votre repository GitHub" -ForegroundColor White
    Write-Host "   - Configurer :" -ForegroundColor White
    Write-Host "     * Framework: Create React App" -ForegroundColor Gray
    Write-Host "     * Root Directory: client" -ForegroundColor Gray
    Write-Host "     * Build Command: npm run build" -ForegroundColor Gray
    Write-Host "     * Output Directory: build" -ForegroundColor Gray
    Write-Host "   - Ajouter les variables d'environnement :" -ForegroundColor White
    Write-Host "     * REACT_APP_API_URL=https://bowoye-backend.onrender.com/api" -ForegroundColor Gray
    Write-Host "     * REACT_APP_ENVIRONMENT=production" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. 🗄️ BASE DE DONNÉES (MONGODB ATLAS) :" -ForegroundColor Yellow
    Write-Host "   - Aller sur https://cloud.mongodb.com" -ForegroundColor White
    Write-Host "   - Créer un cluster gratuit" -ForegroundColor White
    Write-Host "   - Configurer l'accès réseau (0.0.0.0/0)" -ForegroundColor White
    Write-Host "   - Créer un utilisateur de base de données" -ForegroundColor White
    Write-Host "   - Récupérer la chaîne de connexion" -ForegroundColor White
    Write-Host ""
    Write-Host "4. ✅ TESTS POST-DÉPLOIEMENT :" -ForegroundColor Yellow
    Write-Host "   - Tester l'API : https://bowoye-backend.onrender.com/api/health" -ForegroundColor White
    Write-Host "   - Tester le frontend : https://bowoye-frontend.vercel.app" -ForegroundColor White
    Write-Host "   - Vérifier la connexion frontend-backend" -ForegroundColor White
    Write-Host "   - Tester toutes les fonctionnalités" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Guide détaillé disponible dans : GUIDE_DEPLOIEMENT_VERCEL_RENDER.md" -ForegroundColor Cyan
    Write-Host ""
}

# Fonction principale
function Start-Deployment {
    Write-Host "🚀 Déploiement de Bowoye Multi Services" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Vérifier les prérequis
    Test-Prerequisites
    Write-Host ""
    
    # Vérifier les fichiers de configuration
    Test-ConfigFiles
    Write-Host ""
    
    # Générer les fichiers manquants
    New-ConfigFiles
    Write-Host ""
    
    # Préparer le backend
    Initialize-Backend
    Write-Host ""
    
    # Préparer le frontend
    Initialize-Frontend
    Write-Host ""
    
    # Afficher les instructions
    Show-DeploymentInstructions
    
    Write-Success "Préparation du déploiement terminée !"
    Write-Warning "Suivez les instructions ci-dessus pour deployer sur Vercel et Render"
}

# Exécuter le script principal
Start-Deployment
