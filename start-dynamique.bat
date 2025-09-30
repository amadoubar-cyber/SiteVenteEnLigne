@echo off
echo ========================================
echo   KOULA E-COMMERCE - DEMARRAGE DYNAMIQUE
echo ========================================
echo.

echo [1/4] Verification des dependances...
cd /d "%~dp0"

if not exist "server\node_modules" (
    echo Installation des dependances serveur...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Installation des dependances client...
    cd client
    npm install
    cd ..
)

echo.
echo [2/4] Configuration des variables d'environnement...
if not exist "server\.env" (
    echo Creation du fichier .env pour le serveur...
    echo NODE_ENV=development > server\.env
    echo PORT=3001 >> server\.env
    echo MONGODB_URI=mongodb://localhost:27017/koula_ecommerce >> server\.env
    echo JWT_SECRET=koula_super_secret_key_2024_secure >> server\.env
    echo JWT_EXPIRE=7d >> server\.env
)

echo.
echo [3/4] Verification de MongoDB...
echo Veuillez vous assurer que MongoDB est demarre sur votre systeme
echo URL de connexion: mongodb://localhost:27017/koula_ecommerce
echo.

echo [4/4] Demarrage des services...
echo.
echo Serveur API: http://localhost:3001
echo Client React: http://localhost:3000
echo Dashboard Dynamique: http://localhost:3000/dashboard-dynamique.html
echo.

start "Koula Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Koula Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   SERVICES DEMARRES AVEC SUCCES !
echo ========================================
echo.
echo Pour tester le dashboard dynamique:
echo 1. Ouvrez http://localhost:3000/dashboard-dynamique.html
echo 2. Cliquez sur "Actualiser les Donnees"
echo 3. Testez les fonctionnalites
echo.
pause
