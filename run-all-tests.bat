@echo off
echo.
echo ========================================
echo 🧪 TESTS COMPLETS - BOWOYE MULTI SERVICES
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    echo 📥 Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
node --version

echo.
echo 🚀 Démarrage des serveurs...
echo.

REM Démarrer le serveur backend en arrière-plan
echo 📡 Démarrage du serveur backend...
start "Backend Server" /min cmd /c "cd server && npm start"

REM Attendre que le serveur backend démarre
echo ⏳ Attente du démarrage du serveur backend...
timeout /t 5 /nobreak >nul

REM Démarrer le serveur frontend en arrière-plan
echo 🌐 Démarrage du serveur frontend...
start "Frontend Server" /min cmd /c "cd client && npm start"

REM Attendre que le serveur frontend démarre
echo ⏳ Attente du démarrage du serveur frontend...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Serveurs démarrés !
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend: http://localhost:5000
echo.

echo 🧪 Lancement des tests automatisés...
echo.

REM Exécuter les tests automatisés
node test-automatise-fonctionnalites.js

echo.
echo 📊 Tests terminés !
echo.

echo 🌐 Ouverture de l'interface de test web...
echo.

REM Ouvrir l'interface de test web
start "" "test-complet-toutes-fonctionnalites.html"

echo.
echo 📋 Ouverture du guide de test...
echo.

REM Ouvrir le guide de test
start "" "GUIDE_TEST_TOUTES_FONCTIONNALITES.md"

echo.
echo 🎯 RÉSUMÉ:
echo ========================================
echo ✅ Serveurs démarrés
echo ✅ Tests automatisés exécutés
echo ✅ Interface de test ouverte
echo ✅ Guide de test ouvert
echo.
echo 📱 Vous pouvez maintenant:
echo   • Tester manuellement sur http://localhost:3000
echo   • Utiliser l'interface de test web
echo   • Suivre le guide de test détaillé
echo.
echo 🚀 L'application est prête pour les tests !
echo ========================================
echo.

pause
