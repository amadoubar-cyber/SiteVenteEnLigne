// Script pour nettoyer toutes les données de démo du localStorage
// Ce script supprime définitivement toutes les données de démonstration

console.log('🧹 Démarrage du nettoyage des données de démo...');

function cleanAllDemoData() {
    console.log('🔍 Recherche des données de démo...');
    
    // 1. Supprimer les clés de démo explicites
    const explicitDemoKeys = [
        'demoProducts',
        'demoSales',
        'demoOrders',
        'demoUsers',
        'demoStockMovements',
        'demoData',
        'testData',
        'sampleData',
        'exampleData'
    ];
    
    let removedCount = 0;
    explicitDemoKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ Clé ${key} supprimée`);
            removedCount++;
        }
    });
    
    // 2. Supprimer les clés qui contiennent "demo", "test", "sample"
    const allKeys = Object.keys(localStorage);
    const demoKeys = allKeys.filter(key => 
        key.toLowerCase().includes('demo') ||
        key.toLowerCase().includes('test') ||
        key.toLowerCase().includes('sample') ||
        key.toLowerCase().includes('exemple') ||
        key.toLowerCase().includes('temp_') ||
        key.toLowerCase().includes('cache_') ||
        key.toLowerCase().includes('backup_')
    );
    
    demoKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Clé ${key} supprimée`);
        removedCount++;
    });
    
    // 3. Nettoyer les données régulières des éléments de test
    const regularKeys = [
        'koula_products',
        'salesData',
        'ordersData',
        'users',
        'stockMovements',
        'debts',
        'categories'
    ];
    
    regularKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    // Filtrer les éléments de test/démo
                    const cleanedData = parsed.filter(item => {
                        if (!item.name) return true;
                        
                        const name = item.name.toLowerCase();
                        return !(
                            name.includes('test') ||
                            name.includes('demo') ||
                            name.includes('exemple') ||
                            name.includes('sample') ||
                            name.includes('démonstration') ||
                            name.includes('exemple')
                        );
                    });
                    
                    if (cleanedData.length !== parsed.length) {
                        localStorage.setItem(key, JSON.stringify(cleanedData));
                        console.log(`✅ ${parsed.length - cleanedData.length} éléments de test supprimés de ${key}`);
                        removedCount++;
                    }
                }
            } catch (e) {
                console.log(`❌ Erreur lors du nettoyage de ${key}:`, e.message);
            }
        }
    });
    
    console.log(`🎉 Nettoyage terminé: ${removedCount} éléments supprimés`);
    return removedCount;
}

function verifyCleanState() {
    console.log('🔍 Vérification de l\'état propre...');
    
    // Vérifier qu'il n'y a plus de données de démo
    const allKeys = Object.keys(localStorage);
    const remainingDemoKeys = allKeys.filter(key => 
        key.toLowerCase().includes('demo') ||
        key.toLowerCase().includes('test') ||
        key.toLowerCase().includes('sample') ||
        key.toLowerCase().includes('exemple')
    );
    
    if (remainingDemoKeys.length === 0) {
        console.log('✅ État propre confirmé - Aucune donnée de démo détectée');
        return true;
    } else {
        console.log('⚠️  Données de démo restantes:', remainingDemoKeys);
        return false;
    }
}

// Exporter les fonctions pour utilisation manuelle
if (typeof window !== 'undefined') {
    window.cleanDemoData = {
        cleanAll: cleanAllDemoData,
        verify: verifyCleanState
    };
    
    // Exécuter automatiquement le nettoyage
    const removedCount = cleanAllDemoData();
    
    if (removedCount > 0) {
        console.log('🧹 Nettoyage automatique effectué');
        setTimeout(() => {
            verifyCleanState();
        }, 1000);
    } else {
        console.log('✅ Aucune donnée de démo trouvée');
    }
}

// Exporter pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cleanAllDemoData,
        verifyCleanState
    };
}
