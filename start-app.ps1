# Script PowerShell pour démarrer l'application Koula
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEMARRAGE DE L'APPLICATION KOULA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "🚀 Démarrage du client React..." -ForegroundColor Yellow

# Démarrer le client React
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Attente de 3 secondes..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 Démarrage du serveur Node.js..." -ForegroundColor Yellow

# Démarrer le serveur Node.js
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   APPLICATION DEMARREE !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Le client React sera disponible sur: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔧 Le serveur API sera disponible sur: http://localhost:3001" -ForegroundColor Blue
Write-Host ""
Write-Host "🔐 Comptes de test disponibles:" -ForegroundColor Magenta
Write-Host "   👤 Client: client@koula.gn / password123" -ForegroundColor White
Write-Host "   👑 Admin: admin@koula.gn / admin123" -ForegroundColor White
Write-Host ""
Write-Host "📚 Guide complet: GUIDE-DEMARRAGE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
Read-Host
