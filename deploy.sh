#!/bin/bash

# Script de déploiement automatisé pour Bowoye Multi Services
# Frontend sur Vercel + Backend sur Render

echo "🚀 Déploiement de Bowoye Multi Services"
echo "========================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    
    print_success "Tous les prérequis sont installés"
}

# Préparer le backend
prepare_backend() {
    print_status "Préparation du backend..."
    
    cd server
    
    # Installer les dépendances
    print_status "Installation des dépendances du backend..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dépendances backend installées"
    else
        print_error "Erreur lors de l'installation des dépendances backend"
        exit 1
    fi
    
    # Vérifier que le serveur peut démarrer
    print_status "Test du serveur backend..."
    timeout 10s npm start > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 3
    
    if ps -p $SERVER_PID > /dev/null; then
        kill $SERVER_PID
        print_success "Serveur backend testé avec succès"
    else
        print_error "Le serveur backend ne peut pas démarrer"
        exit 1
    fi
    
    cd ..
}

# Préparer le frontend
prepare_frontend() {
    print_status "Préparation du frontend..."
    
    cd client
    
    # Installer les dépendances
    print_status "Installation des dépendances du frontend..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dépendances frontend installées"
    else
        print_error "Erreur lors de l'installation des dépendances frontend"
        exit 1
    fi
    
    # Test de build
    print_status "Test de build du frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build frontend réussi"
    else
        print_error "Erreur lors du build frontend"
        exit 1
    fi
    
    cd ..
}

# Vérifier les fichiers de configuration
check_config_files() {
    print_status "Vérification des fichiers de configuration..."
    
    # Vérifier vercel.json
    if [ -f "vercel.json" ]; then
        print_success "vercel.json trouvé"
    else
        print_warning "vercel.json manquant - sera créé automatiquement"
    fi
    
    # Vérifier render.yaml
    if [ -f "render.yaml" ]; then
        print_success "render.yaml trouvé"
    else
        print_warning "render.yaml manquant - sera créé automatiquement"
    fi
    
    # Vérifier package.json
    if [ -f "client/package.json" ]; then
        print_success "package.json frontend trouvé"
    else
        print_error "package.json frontend manquant"
        exit 1
    fi
    
    if [ -f "server/package.json" ]; then
        print_success "package.json backend trouvé"
    else
        print_error "package.json backend manquant"
        exit 1
    fi
}

# Générer les fichiers de configuration manquants
generate_config_files() {
    print_status "Génération des fichiers de configuration..."
    
    # Créer vercel.json si manquant
    if [ ! -f "vercel.json" ]; then
        cat > vercel.json << EOF
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
      "dest": "/static/\$1"
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
EOF
        print_success "vercel.json créé"
    fi
    
    # Créer render.yaml si manquant
    if [ ! -f "render.yaml" ]; then
        cat > render.yaml << EOF
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
EOF
        print_success "render.yaml créé"
    fi
}

# Instructions pour le déploiement manuel
deployment_instructions() {
    print_status "Instructions de déploiement..."
    
    echo ""
    echo "📋 ÉTAPES SUIVANTES POUR LE DÉPLOIEMENT :"
    echo "========================================"
    echo ""
    echo "1. 🌐 DÉPLOIEMENT BACKEND (RENDER) :"
    echo "   - Aller sur https://render.com"
    echo "   - Créer un nouveau Web Service"
    echo "   - Connecter votre repository GitHub"
    echo "   - Configurer :"
    echo "     * Build Command: cd server && npm install"
    echo "     * Start Command: cd server && node index.js"
    echo "     * Environment: Node"
    echo "   - Ajouter les variables d'environnement :"
    echo "     * NODE_ENV=production"
    echo "     * PORT=10000"
    echo "     * MONGODB_URI=votre-mongodb-uri"
    echo "     * JWT_SECRET=votre-jwt-secret"
    echo "     * CORS_ORIGIN=https://bowoye-frontend.vercel.app"
    echo ""
    echo "2. 🎨 DÉPLOIEMENT FRONTEND (VERCEL) :"
    echo "   - Aller sur https://vercel.com"
    echo "   - Créer un nouveau projet"
    echo "   - Connecter votre repository GitHub"
    echo "   - Configurer :"
    echo "     * Framework: Create React App"
    echo "     * Root Directory: client"
    echo "     * Build Command: npm run build"
    echo "     * Output Directory: build"
    echo "   - Ajouter les variables d'environnement :"
    echo "     * REACT_APP_API_URL=https://bowoye-backend.onrender.com/api"
    echo "     * REACT_APP_ENVIRONMENT=production"
    echo ""
    echo "3. 🗄️ BASE DE DONNÉES (MONGODB ATLAS) :"
    echo "   - Aller sur https://cloud.mongodb.com"
    echo "   - Créer un cluster gratuit"
    echo "   - Configurer l'accès réseau (0.0.0.0/0)"
    echo "   - Créer un utilisateur de base de données"
    echo "   - Récupérer la chaîne de connexion"
    echo ""
    echo "4. ✅ TESTS POST-DÉPLOIEMENT :"
    echo "   - Tester l'API : https://bowoye-backend.onrender.com/api/health"
    echo "   - Tester le frontend : https://bowoye-frontend.vercel.app"
    echo "   - Vérifier la connexion frontend-backend"
    echo "   - Tester toutes les fonctionnalités"
    echo ""
    echo "📚 Guide détaillé disponible dans : GUIDE_DEPLOIEMENT_VERCEL_RENDER.md"
    echo ""
}

# Fonction principale
main() {
    echo "🚀 Déploiement de Bowoye Multi Services"
    echo "========================================"
    echo ""
    
    # Vérifier les prérequis
    check_prerequisites
    echo ""
    
    # Vérifier les fichiers de configuration
    check_config_files
    echo ""
    
    # Générer les fichiers manquants
    generate_config_files
    echo ""
    
    # Préparer le backend
    prepare_backend
    echo ""
    
    # Préparer le frontend
    prepare_frontend
    echo ""
    
    # Afficher les instructions
    deployment_instructions
    
    print_success "Préparation du déploiement terminée !"
    print_warning "Suivez les instructions ci-dessus pour déployer sur Vercel et Render"
}

# Exécuter le script principal
main "$@"