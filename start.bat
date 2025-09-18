@echo off
echo 🚀 Démarrage de Koula E-commerce...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo 📥 Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Node.js et npm sont installés
echo.

REM Arrêter les processus Node.js existants
echo 🔍 Arrêt des processus Node.js existants...
taskkill /f /im node.exe >nul 2>&1

REM Attendre que les ports se libèrent
echo ⏳ Attente de la libération des ports...
timeout /t 3 /nobreak >nul

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances racine...
    npm install
)

if not exist "server\node_modules" (
    echo 📦 Installation des dépendances serveur...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo 📦 Installation des dépendances client...
    cd client
    npm install
    cd ..
)

echo.
echo 🚀 Démarrage des services...
echo.

REM Démarrer le serveur en arrière-plan
start "Koula Server" cmd /k "cd server && npm run dev"

REM Attendre que le serveur démarre
echo ⏳ Attente du démarrage du serveur...
timeout /t 8 /nobreak >nul

REM Démarrer le client
start "Koula Client" cmd /k "cd client && npm start"

echo.
echo ✅ Les services sont en cours de démarrage...
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 Fermez cette fenêtre pour arrêter les services
echo 🔄 Ou utilisez Ctrl+C dans les fenêtres des services
pause