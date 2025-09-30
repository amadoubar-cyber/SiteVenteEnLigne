@echo off
echo 🔄 Mise à jour du projet Bowoye Multi Services sur GitHub
echo ========================================================

echo.
echo 📋 Vérification du statut Git...
git status

echo.
echo 📁 Ajout des nouveaux fichiers...
git add .

echo.
echo 📝 Création du commit...
git commit -m "Mise à jour: Configuration déploiement et documentation

- Ajout configuration Vercel et Render
- Scripts de déploiement automatisés  
- Guides de déploiement complets
- Documentation mise à jour
- Préparation pour déploiement production"

echo.
echo 🚀 Envoi vers GitHub...
git push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Mise à jour terminée avec succès !
    echo.
    echo 🌐 Votre repository GitHub a été mis à jour
    echo.
    echo 📋 Prochaines étapes :
    echo 1. Vérifier que tous les fichiers sont sur GitHub
    echo 2. Suivre le guide de déploiement
    echo 3. Déployer sur Vercel et Render
    echo.
    echo 📚 Guide de déploiement : GUIDE_DEPLOIEMENT_VERCEL_RENDER.md
) else (
    echo.
    echo ❌ Erreur lors de la mise à jour
    echo.
    echo 🔧 Solutions possibles :
    echo 1. Vérifier votre connexion internet
    echo 2. Vérifier vos credentials GitHub
    echo 3. Essayer : git pull puis git push
    echo.
    echo 📚 Guide de mise à jour : GUIDE_UPDATE_GITHUB.md
)

echo.
pause
