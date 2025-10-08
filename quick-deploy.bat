@echo off
echo ============================================
echo   VERIFICATION ET DEPLOIEMENT RAPIDE
echo   Bowoye Backend - Render
echo ============================================
echo.

echo [1/4] Verification de la configuration...
node verify-deployment.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: La verification a echoue.
    echo Corrigez les erreurs avant de continuer.
    pause
    exit /b 1
)

echo.
echo [2/4] Ajout des fichiers modifies...
git add server/config/database.js server/index.js render.yaml

echo.
echo [3/4] Commit des modifications...
git commit -m "Fix: Correction configuration Render - suppression options Mongoose deprecies"

echo.
echo [4/4] Push vers GitHub...
git push origin main

echo.
echo ============================================
echo   DEPLOIEMENT LANCE!
echo ============================================
echo.
echo Le deploiement est en cours sur Render.
echo Surveillez les logs sur: https://dashboard.render.com
echo.
echo Votre API sera disponible dans 2-5 minutes a:
echo https://bowoye-backend.onrender.com/api/health
echo.
pause

