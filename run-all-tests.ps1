# 🧪 Script de Test Complet - Bowoye Multi Services
# PowerShell Script pour tester toutes les fonctionnalités

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "🧪 TESTS COMPLETS - BOWOYE MULTI SERVICES" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js non trouvé"
    }
} catch {
    Write-Host "❌ Node.js n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Veuillez installer Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host ""
Write-Host "🚀 Démarrage des serveurs..." -ForegroundColor Blue
Write-Host ""

# Fonction pour démarrer un serveur
function Start-Server {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "📡 Démarrage de $Name..." -ForegroundColor Cyan
    $process = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"$Path`" && $Command" -WindowStyle Minimized -PassThru
    return $process
}

# Démarrer le serveur backend
$backendProcess = Start-Server -Name "Backend Server" -Path "server" -Command "npm start"

# Attendre que le serveur backend démarre
Write-Host "⏳ Attente du démarrage du serveur backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Démarrer le serveur frontend
$frontendProcess = Start-Server -Name "Frontend Server" -Path "client" -Command "npm start"

# Attendre que le serveur frontend démarre
Write-Host "⏳ Attente du démarrage du serveur frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Serveurs démarrés !" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

Write-Host "🧪 Lancement des tests automatisés..." -ForegroundColor Blue
Write-Host ""

# Exécuter les tests automatisés
try {
    node test-automatise-fonctionnalites.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tests automatisés terminés avec succès !" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Certains tests ont échoué" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors de l'exécution des tests: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Tests terminés !" -ForegroundColor Blue
Write-Host ""

Write-Host "🌐 Ouverture de l'interface de test web..." -ForegroundColor Blue
Write-Host ""

# Ouvrir l'interface de test web
try {
    Start-Process "test-complet-toutes-fonctionnalites.html"
    Write-Host "✅ Interface de test ouverte" -ForegroundColor Green
} catch {
    Write-Host "❌ Impossible d'ouvrir l'interface de test" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Ouverture du guide de test..." -ForegroundColor Blue
Write-Host ""

# Ouvrir le guide de test
try {
    Start-Process "GUIDE_TEST_TOUTES_FONCTIONNALITES.md"
    Write-Host "✅ Guide de test ouvert" -ForegroundColor Green
} catch {
    Write-Host "❌ Impossible d'ouvrir le guide de test" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 RÉSUMÉ:" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "✅ Serveurs démarrés" -ForegroundColor Green
Write-Host "✅ Tests automatisés exécutés" -ForegroundColor Green
Write-Host "✅ Interface de test ouverte" -ForegroundColor Green
Write-Host "✅ Guide de test ouvert" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Vous pouvez maintenant:" -ForegroundColor Cyan
Write-Host "  • Tester manuellement sur http://localhost:3000" -ForegroundColor White
Write-Host "  • Utiliser l'interface de test web" -ForegroundColor White
Write-Host "  • Suivre le guide de test détaillé" -ForegroundColor White
Write-Host ""
Write-Host "🚀 L'application est prête pour les tests !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Fonction pour arrêter les serveurs à la fin
function Stop-AllServers {
    Write-Host ""
    Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Yellow
    try {
        if ($backendProcess -and !$backendProcess.HasExited) {
            $backendProcess.Kill()
            Write-Host "✅ Serveur backend arrêté" -ForegroundColor Green
        }
        if ($frontendProcess -and !$frontendProcess.HasExited) {
            $frontendProcess.Kill()
            Write-Host "✅ Serveur frontend arrêté" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️ Erreur lors de l'arrêt des serveurs" -ForegroundColor Yellow
    }
}

# Enregistrer la fonction d'arrêt
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Stop-AllServers
}

Write-Host "💡 Conseil: Fermez cette fenêtre pour arrêter les serveurs" -ForegroundColor Yellow
Write-Host ""

Read-Host "Appuyez sur Entrée pour continuer ou Ctrl+C pour arrêter les serveurs"

# Arrêter les serveurs
Stop-AllServers
