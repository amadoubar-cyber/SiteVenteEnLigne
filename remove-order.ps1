# Script PowerShell pour supprimer une commande spécifique
# Commande à supprimer: ON90704467

Write-Host "🗑️ Suppression de la commande ON90704467" -ForegroundColor Red
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "Veuillez installer Node.js ou utiliser le fichier HTML à la place" -ForegroundColor Yellow
    exit 1
}

# Créer un script JavaScript temporaire
$jsScript = @"
// Script pour supprimer la commande ON90704467
console.log('🔍 Recherche de la commande ON90704467...');

// Simuler localStorage pour Node.js
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        data: {},
        getItem: function(key) {
            return this.data[key] || null;
        },
        setItem: function(key, value) {
            this.data[key] = value;
        },
        removeItem: function(key) {
            delete this.data[key];
        },
        clear: function() {
            this.data = {};
        }
    };
}

// Lire le fichier de données s'il existe
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de données (si existant)
const dataFile = path.join(__dirname, 'client', 'public', 'orders-data.json');

let orders = [];

// Essayer de lire depuis le fichier
if (fs.existsSync(dataFile)) {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        orders = JSON.parse(data);
        console.log('📁 Données chargées depuis le fichier');
    } catch (error) {
        console.log('⚠️ Erreur lors de la lecture du fichier:', error.message);
    }
}

// Essayer de lire depuis localStorage simulé
if (orders.length === 0) {
    try {
        const localStorageData = localStorage.getItem('clientOrders');
        if (localStorageData) {
            orders = JSON.parse(localStorageData);
            console.log('💾 Données chargées depuis localStorage simulé');
        }
    } catch (error) {
        console.log('⚠️ Erreur lors de la lecture de localStorage:', error.message);
    }
}

console.log(\`📊 Total des commandes: \${orders.length}\`);

// Rechercher la commande spécifique
const targetOrder = orders.find(order => order.trackingNumber === 'ON90704467');

if (targetOrder) {
    console.log('✅ Commande ON90704467 trouvée:');
    console.log('   - ID:', targetOrder._id);
    console.log('   - Statut:', targetOrder.orderStatus);
    console.log('   - Client:', targetOrder.user?.firstName, targetOrder.user?.lastName);
    console.log('   - Date:', targetOrder.createdAt);
    
    // Supprimer la commande
    const initialCount = orders.length;
    orders = orders.filter(order => order.trackingNumber !== 'ON90704467');
    const removedCount = initialCount - orders.length;
    
    console.log(\`🗑️ Commande supprimée! (\${removedCount} commande(s) supprimée(s))\`);
    
    // Sauvegarder les données
    try {
        if (fs.existsSync(path.dirname(dataFile))) {
            fs.writeFileSync(dataFile, JSON.stringify(orders, null, 2));
            console.log('💾 Données sauvegardées dans le fichier');
        }
        
        // Mettre à jour localStorage simulé
        localStorage.setItem('clientOrders', JSON.stringify(orders));
        console.log('💾 Données mises à jour dans localStorage simulé');
        
        console.log('✅ Suppression terminée avec succès!');
        
    } catch (error) {
        console.log('❌ Erreur lors de la sauvegarde:', error.message);
    }
    
} else {
    console.log('❌ Commande ON90704467 non trouvée');
    console.log('📋 Commandes disponibles:');
    orders.forEach(order => {
        console.log(\`   - \${order.trackingNumber} (\${order.orderStatus})\`);
    });
}

console.log(\`📊 Nouvelles données: \${orders.length} commande(s) restante(s)\`);
"@

# Écrire le script temporaire
$tempJsFile = "temp-remove-order.js"
$jsScript | Out-File -FilePath $tempJsFile -Encoding UTF8

try {
    # Exécuter le script
    Write-Host "🚀 Exécution du script de suppression..." -ForegroundColor Yellow
    node $tempJsFile
    
    Write-Host ""
    Write-Host "✅ Script terminé!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Instructions:" -ForegroundColor Cyan
    Write-Host "1. Ouvrez votre application React" -ForegroundColor White
    Write-Host "2. Allez dans la section Validation des Commandes" -ForegroundColor White
    Write-Host "3. Vérifiez que la commande ON90704467 n'apparaît plus" -ForegroundColor White
    Write-Host "4. Si nécessaire, actualisez la page (F5)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors de l'exécution du script:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    # Nettoyer le fichier temporaire
    if (Test-Path $tempJsFile) {
        Remove-Item $tempJsFile -Force
        Write-Host "🧹 Fichier temporaire supprimé" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "💡 Alternative: Ouvrez 'remove-specific-order.html' dans votre navigateur" -ForegroundColor Yellow
