#!/bin/bash

echo "============================================"
echo "  VERIFICATION ET DEPLOIEMENT RAPIDE"
echo "  Bowoye Backend - Render"
echo "============================================"
echo ""

echo "[1/4] Vérification de la configuration..."
node verify-deployment.js
if [ $? -ne 0 ]; then
    echo ""
    echo "ERREUR: La vérification a échoué."
    echo "Corrigez les erreurs avant de continuer."
    exit 1
fi

echo ""
echo "[2/4] Ajout des fichiers modifiés..."
git add server/config/database.js server/index.js render.yaml

echo ""
echo "[3/4] Commit des modifications..."
git commit -m "Fix: Correction configuration Render - suppression options Mongoose dépréciées"

echo ""
echo "[4/4] Push vers GitHub..."
git push origin main

echo ""
echo "============================================"
echo "  DÉPLOIEMENT LANCÉ!"
echo "============================================"
echo ""
echo "Le déploiement est en cours sur Render."
echo "Surveillez les logs sur: https://dashboard.render.com"
echo ""
echo "Votre API sera disponible dans 2-5 minutes à:"
echo "https://bowoye-backend.onrender.com/api/health"
echo ""

