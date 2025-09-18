#!/bin/bash

echo "🚀 Démarrage de Koula E-commerce"
echo "================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js (v16 ou supérieur)"
    exit 1
fi

# Vérifier si MongoDB est installé
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé localement."
    echo "   Assurez-vous d'avoir MongoDB en cours d'exécution ou utilisez MongoDB Atlas"
fi

echo "📦 Installation des dépendances..."

# Installer les dépendances
npm install

echo "🔧 Installation des dépendances du serveur..."
cd server && npm install && cd ..

echo "🎨 Installation des dépendances du client..."
cd client && npm install && cd ..

echo "🌱 Création des données de test..."
cd server && npm run seed && cd ..

echo "✅ Installation terminée !"
echo ""
echo "🚀 Pour démarrer l'application :"
echo "   npm run dev"
echo ""
echo "📱 L'application sera accessible sur :"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👤 Comptes de test :"
echo "   Admin:  admin@koula.gn / admin123"
echo "   Client: client@koula.gn / password123"
echo ""
echo "🎉 Bon développement avec Koula !"
