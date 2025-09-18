@echo off
echo 🚀 Démarrage de Bowoye Multi Services (Version Propre)
echo.

echo 📦 Installation des dépendances...
cd server
call npm install
cd ..\client
call npm install
cd ..

echo.
echo 🧹 Nettoyage de la base de données...
cd server
node scripts/clearDatabase.js
node scripts/createBasicAdmin.js
cd ..

echo.
echo ✅ Application prête !
echo.
echo 📝 Instructions :
echo   1. Ouvrez un nouveau terminal
echo   2. cd server
echo   3. npm start
echo.
echo   4. Ouvrez un autre terminal
echo   5. cd client  
echo   6. npm start
echo.
echo 🌐 URLs :
echo   - Frontend: http://localhost:3001
echo   - Admin: http://localhost:3001/admin-simple-complete
echo   - Login: admin@bowoye.gn / admin123
echo.
pause
