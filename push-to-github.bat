@echo off
echo 🚀 Envoi du projet Bowoye Multi Services sur GitHub
echo ================================================

echo.
echo 📋 Vérification des fichiers...
if not exist "client" (
    echo ❌ Dossier client manquant
    pause
    exit /b 1
)

if not exist "server" (
    echo ❌ Dossier server manquant
    pause
    exit /b 1
)

if not exist ".gitignore" (
    echo ❌ Fichier .gitignore manquant
    pause
    exit /b 1
)

if not exist "README.md" (
    echo ❌ Fichier README.md manquant
    pause
    exit /b 1
)

echo ✅ Tous les fichiers requis sont présents

echo.
echo 🔧 Configuration Git...
git config --global user.name
git config --global user.email

echo.
echo 📦 Initialisation Git...
if not exist ".git" (
    git init
    echo ✅ Git initialisé
) else (
    echo ✅ Git déjà initialisé
)

echo.
echo 📁 Ajout des fichiers...
git add .

echo.
echo 📝 Création du commit...
git commit -m "Initial commit: Plateforme e-commerce Bowoye Multi Services

- Frontend React avec interface client et admin
- Backend Node.js avec API complète
- Système de commentaires et avis
- Gestion des produits, commandes, utilisateurs
- Configuration pour déploiement Vercel + Render
- Documentation complète et scripts de déploiement"

echo.
echo 🌐 Configuration du repository GitHub...
echo.
echo Veuillez entrer l'URL de votre repository GitHub :
echo Exemple : https://github.com/VOTRE-USERNAME/bowoye-multi-services.git
set /p REPO_URL="URL du repository : "

if "%REPO_URL%"=="" (
    echo ❌ URL du repository requise
    pause
    exit /b 1
)

git remote add origin %REPO_URL%

echo.
echo 🚀 Envoi vers GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Succès ! Votre projet a été envoyé sur GitHub
    echo.
    echo 🌐 Votre repository : %REPO_URL%
    echo.
    echo 📋 Prochaines étapes :
    echo 1. Vérifier que tous les fichiers sont sur GitHub
    echo 2. Suivre le guide de déploiement
    echo 3. Déployer sur Vercel et Render
    echo.
    echo 📚 Guide de déploiement : GUIDE_DEPLOIEMENT_VERCEL_RENDER.md
) else (
    echo.
    echo ❌ Erreur lors de l'envoi vers GitHub
    echo.
    echo 🔧 Solutions possibles :
    echo 1. Vérifier l'URL du repository
    echo 2. Vérifier vos credentials GitHub
    echo 3. Vérifier que le repository existe
    echo.
    echo 📚 Guide GitHub : GUIDE_GITHUB_DEPLOIEMENT.md
)

echo.
pause
