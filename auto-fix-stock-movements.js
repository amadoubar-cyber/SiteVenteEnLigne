// Script de correction automatique des mouvements de stock
// Ce script corrige automatiquement le problème des mouvements de stock qui affichent des zéros

console.log('🔧 Script de correction automatique des mouvements de stock chargé');

// Fonction pour corriger automatiquement les mouvements de stock
function autoFixStockMovements() {
    console.log('🔧 Démarrage de la correction automatique...');
    
    try {
        const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
        const sales = JSON.parse(localStorage.getItem('salesData') || '[]');
        const existingMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
        
        console.log(`📦 ${products.length} produits trouvés`);
        console.log(`💰 ${sales.length} ventes trouvées`);
        console.log(`📊 ${existingMovements.length} mouvements existants`);
        
        let movementsCreated = 0;
        
        // 1. Créer des mouvements initiaux pour tous les produits sans mouvements
        const productsWithoutMovements = products.filter(product => 
            !existingMovements.some(m => m.productId === product._id)
        );
        
        if (productsWithoutMovements.length > 0) {
            console.log(`📦 Création de mouvements initiaux pour ${productsWithoutMovements.length} produits`);
            
            const initialMovements = productsWithoutMovements.map(product => ({
                _id: 'auto-initial-' + product._id + '-' + Date.now(),
                productId: product._id,
                productName: product.name,
                type: 'in',
                quantity: product.stock || 0,
                reason: 'Stock initial',
                category: product.productType || 'construction',
                notes: 'Mouvement initial créé automatiquement',
                date: product.createdAt || new Date().toISOString(),
                createdAt: new Date().toISOString(),
                reference: 'AUTO-INIT-' + product._id.substring(0, 8).toUpperCase()
            }));
            
            existingMovements.push(...initialMovements);
            movementsCreated += initialMovements.length;
            console.log(`✅ ${initialMovements.length} mouvements initiaux créés`);
        }
        
        // 2. Créer des mouvements de sortie pour toutes les ventes sans mouvements
        const salesWithoutMovements = sales.filter(sale => 
            !existingMovements.some(m => m.saleId === sale._id || 
                (m.type === 'out' && m.reason === 'Vente client' && 
                 m.productName === sale.productName && 
                 m.quantity === (sale.quantity || 1)))
        );
        
        if (salesWithoutMovements.length > 0) {
            console.log(`💰 Création de mouvements de vente pour ${salesWithoutMovements.length} ventes`);
            
            const salesMovements = salesWithoutMovements.map(sale => {
                // Trouver le produit correspondant
                const product = products.find(p => 
                    p.name === sale.productName || 
                    p._id === sale.productId ||
                    p.name.toLowerCase().includes((sale.productName || '').toLowerCase())
                );
                
                if (product) {
                    return {
                        _id: 'auto-sale-' + sale._id + '-' + Date.now(),
                        productId: product._id,
                        productName: product.name,
                        type: 'out',
                        quantity: sale.quantity || 1,
                        reason: 'Vente client',
                        category: product.productType || 'construction',
                        notes: `Vente automatique - ${sale.customerName || 'client inconnu'}`,
                        date: sale.createdAt || new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        reference: 'AUTO-SALE-' + sale._id.substring(0, 8).toUpperCase(),
                        saleId: sale._id
                    };
                }
                return null;
            }).filter(Boolean);
            
            existingMovements.push(...salesMovements);
            movementsCreated += salesMovements.length;
            console.log(`✅ ${salesMovements.length} mouvements de vente créés`);
        }
        
        // 3. Nettoyer les doublons et mouvements orphelins
        const validProductIds = products.map(p => p._id);
        const cleanedMovements = existingMovements
            .filter(movement => validProductIds.includes(movement.productId))
            .filter((movement, index, self) => 
                index === self.findIndex(m => m._id === movement._id)
            );
        
        // 4. Mettre à jour les noms des produits dans les mouvements
        const updatedMovements = cleanedMovements.map(movement => {
            const product = products.find(p => p._id === movement.productId);
            if (product) {
                return {
                    ...movement,
                    productName: product.name,
                    category: product.productType || 'construction'
                };
            }
            return movement;
        });
        
        // 5. Sauvegarder
        localStorage.setItem('stockMovements', JSON.stringify(updatedMovements));
        
        console.log(`✅ ${movementsCreated} mouvements créés automatiquement`);
        console.log(`✅ ${updatedMovements.length} mouvements totaux sauvegardés`);
        console.log('🎉 Correction automatique terminée avec succès!');
        
        return {
            success: true,
            movementsCreated: movementsCreated,
            totalMovements: updatedMovements.length,
            products: products.length,
            sales: sales.length
        };
        
    } catch (error) {
        console.error('❌ Erreur lors de la correction automatique:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Fonction pour vérifier l'état des mouvements de stock
function checkStockMovementsStatus() {
    console.log('🔍 Vérification de l\'état des mouvements de stock...');
    
    const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
    const sales = JSON.parse(localStorage.getItem('salesData') || '[]');
    const movements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    
    console.log(`📊 État actuel:`);
    console.log(`   - Produits: ${products.length}`);
    console.log(`   - Ventes: ${sales.length}`);
    console.log(`   - Mouvements: ${movements.length}`);
    
    if (movements.length > 0) {
        const inMovements = movements.filter(m => m.type === 'in');
        const outMovements = movements.filter(m => m.type === 'out');
        
        const totalIn = inMovements.reduce((sum, m) => sum + (m.quantity || 0), 0);
        const totalOut = outMovements.reduce((sum, m) => sum + (m.quantity || 0), 0);
        
        console.log(`   - Entrées: ${totalIn}`);
        console.log(`   - Sorties: ${totalOut}`);
        console.log(`   - Stock actuel: ${totalIn - totalOut}`);
        
        if (totalIn > 0 || totalOut > 0) {
            console.log('✅ Mouvements de stock fonctionnels');
            return true;
        } else {
            console.log('❌ Mouvements de stock affichent des zéros');
            return false;
        }
    } else {
        console.log('❌ Aucun mouvement de stock trouvé');
        return false;
    }
}

// Fonction pour surveiller les changements et corriger automatiquement
function startStockMovementsMonitor() {
    console.log('👁️ Surveillance des mouvements de stock activée');
    
    // Surveiller les changements de localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Exécuter la fonction originale
        const result = originalSetItem.call(this, key, value);
        
        // Si des produits ou des ventes sont modifiés, vérifier les mouvements
        if (key === 'koula_products' || key === 'salesData') {
            setTimeout(() => {
                if (!checkStockMovementsStatus()) {
                    console.log('🔧 Correction automatique déclenchée...');
                    autoFixStockMovements();
                }
            }, 1000);
        }
        
        return result;
    };
    
    // Vérifier l'état au démarrage
    setTimeout(() => {
        if (!checkStockMovementsStatus()) {
            console.log('🔧 Correction automatique au démarrage...');
            autoFixStockMovements();
        }
    }, 2000);
}

// Fonction pour forcer la correction
function forceStockMovementsFix() {
    console.log('🔧 Correction forcée des mouvements de stock...');
    return autoFixStockMovements();
}

// Exporter les fonctions pour utilisation manuelle
window.stockMovementsFix = {
    autoFix: autoFixStockMovements,
    checkStatus: checkStockMovementsStatus,
    startMonitor: startStockMovementsMonitor,
    forceFix: forceStockMovementsFix
};

// Démarrer automatiquement la surveillance
if (typeof window !== 'undefined') {
    startStockMovementsMonitor();
    console.log('🚀 Surveillance automatique des mouvements de stock démarrée');
}

// Exporter pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        autoFixStockMovements,
        checkStockMovementsStatus,
        startStockMovementsMonitor,
        forceStockMovementsFix
    };
}
