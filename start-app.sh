#!/bin/bash

echo "========================================"
echo "   DEMARRAGE DE L'APPLICATION KOULA"
echo "========================================"
echo

echo "Demarrage du client React..."
cd client && npm start &
CLIENT_PID=$!

echo
echo "Demarrage du serveur Node.js..."
cd ../server && npm start &
SERVER_PID=$!

echo
echo "========================================"
echo "   APPLICATION DEMARREE !"
echo "========================================"
echo
echo "Le client React sera disponible sur: http://localhost:3000"
echo "Le serveur API sera disponible sur: http://localhost:3001"
echo
echo "Comptes de test disponibles:"
echo "- Client: client@koula.gn / password123"
echo "- Admin: admin@koula.gn / admin123"
echo
echo "Appuyez sur Ctrl+C pour arreter l'application..."

# Fonction pour nettoyer les processus
cleanup() {
    echo "Arret de l'application..."
    kill $CLIENT_PID 2>/dev/null
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait
