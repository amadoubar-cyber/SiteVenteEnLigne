#!/bin/bash

# Script de déploiement pour Bowoye Multi Services
# Usage: ./deploy.sh

echo "🚀 Déploiement de Bowoye Multi Services..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

print_status "Node.js et npm sont installés"

# Installation des dépendances du serveur
echo "📦 Installation des dépendances du serveur..."
cd server
if npm install --production; then
    print_status "Dépendances du serveur installées"
else
    print_error "Erreur lors de l'installation des dépendances du serveur"
    exit 1
fi

# Installation des dépendances du client
echo "📦 Installation des dépendances du client..."
cd ../client
if npm install; then
    print_status "Dépendances du client installées"
else
    print_error "Erreur lors de l'installation des dépendances du client"
    exit 1
fi

# Build de production du client
echo "🔨 Build de production du client..."
if npm run build; then
    print_status "Build de production terminé"
else
    print_error "Erreur lors du build de production"
    exit 1
fi

# Retour au répertoire racine
cd ..

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 n'est pas installé. Installation..."
    if npm install -g pm2; then
        print_status "PM2 installé"
    else
        print_error "Erreur lors de l'installation de PM2"
        exit 1
    fi
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f server/.env ]; then
    print_warning "Création du fichier .env..."
    cat > server/.env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/koula_ecommerce
JWT_SECRET=your_super_secure_jwt_secret_here_change_in_production
JWT_EXPIRE=30d
EOF
    print_status "Fichier .env créé"
fi

# Démarrer l'application avec PM2
echo "🚀 Démarrage de l'application..."
if pm2 start ecosystem.config.js; then
    print_status "Application démarrée avec PM2"
else
    print_error "Erreur lors du démarrage de l'application"
    exit 1
fi

# Sauvegarder la configuration PM2
pm2 save

print_status "Déploiement terminé avec succès !"
print_warning "N'oubliez pas de :"
echo "  1. Configurer votre base de données MongoDB"
echo "  2. Configurer votre serveur web (Nginx/Apache)"
echo "  3. Configurer votre certificat SSL"
echo "  4. Changer le JWT_SECRET en production"

echo ""
echo "🔗 URLs de test :"
echo "  - API: http://localhost:3000/api/health"
echo "  - Frontend: http://localhost:3001"
echo "  - Admin: http://localhost:3001/admin-simple-complete"

echo ""
echo "📊 Commandes utiles :"
echo "  - Voir les logs: pm2 logs bowoye-api"
echo "  - Redémarrer: pm2 restart bowoye-api"
echo "  - Arrêter: pm2 stop bowoye-api"
echo "  - Status: pm2 status"
