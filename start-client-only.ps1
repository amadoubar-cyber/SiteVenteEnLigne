Write-Host "🚀 Démarrage du client React uniquement..." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Note: Le serveur backend n'est pas nécessaire pour les images" -ForegroundColor Yellow
Write-Host "   car elles sont maintenant encodées en base64." -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 L'application sera disponible sur: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🧪 Test des images: http://localhost:3000/test-images-simple.html" -ForegroundColor Cyan
Write-Host ""

Set-Location client
npm start
