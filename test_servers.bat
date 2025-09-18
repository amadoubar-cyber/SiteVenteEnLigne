@echo off
echo 🚀 Test des serveurs Bowoye Multi Services
echo.

echo 📦 Vérification du backend...
cd server
start "Backend Server" cmd /k "npm start"
cd ..

echo.
echo 📦 Vérification du frontend...
cd client
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ✅ Les deux serveurs sont en cours de démarrage...
echo.
echo 🌐 URLs de test :
echo   - Frontend: http://localhost:3001
echo   - Backend: http://localhost:3000
echo.
echo 👥 Comptes de test :
echo   - Admin: admin@bowoye.gn / admin123
echo   - Client: client@bowoye.gn / password123
echo.
echo ⏳ Attendez que les deux serveurs se chargent complètement...
echo.
pause
