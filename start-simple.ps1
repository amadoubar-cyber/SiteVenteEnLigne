Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Green

# Démarrer le client React
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host "✅ Client React démarré sur http://localhost:3000" -ForegroundColor Blue
Write-Host "📝 Test des images: http://localhost:3000/test-quick.html" -ForegroundColor Yellow
Write-Host "🔐 Compte client: client@koula.gn / password123" -ForegroundColor Magenta
Write-Host "👑 Compte admin: admin@koula.gn / admin123" -ForegroundColor Magenta

Read-Host "Appuyez sur Entrée pour continuer"
