@echo off
echo ========================================
echo   DEMARRAGE DE L'APPLICATION KOULA
echo ========================================
echo.

echo Demarrage du client React...
start "Client React" cmd /k "cd client && npm start"

echo.
echo Demarrage du serveur Node.js...
start "Serveur Node" cmd /k "cd server && npm start"

echo.
echo ========================================
echo   APPLICATION DEMARREE !
echo ========================================
echo.
echo Le client React sera disponible sur: http://localhost:3000
echo Le serveur API sera disponible sur: http://localhost:3001
echo.
echo Comptes de test disponibles:
echo - Client: client@koula.gn / password123
echo - Admin: admin@koula.gn / admin123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
