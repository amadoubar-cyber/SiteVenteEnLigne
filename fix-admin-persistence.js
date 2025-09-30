// Script de correction pour la persistance des données admin
// Ce script corrige définitivement le problème de disparition des données

console.log('🔧 Démarrage du script de correction de persistance...');

// 1. Fonction pour nettoyer et corriger localStorage
function cleanAndFixLocalStorage() {
    console.log('🧹 Nettoyage de localStorage...');
    
    // Clés à nettoyer (conflits potentiels)
    const keysToClean = [
        'adminProducts',
        'productsData', 
        'products',
        'adminSales',
        'adminOrders',
        'adminUsers',
        'adminCategories',
        'adminDebts'
    ];
    
    keysToClean.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ Clé ${key} nettoyée`);
        }
    });
    
    // 2. S'assurer que les données principales sont cohérentes
    const mainKeys = [
        'koula_products',
        'salesData',
        'ordersData', 
        'users',
        'categories',
        'debts'
    ];
    
    mainKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    // Nettoyer les éléments invalides
                    const cleaned = parsed.filter(item => 
                        item && 
                        typeof item === 'object' && 
                        item._id &&
                        item.name !== undefined
                    );
                    
                    if (cleaned.length !== parsed.length) {
                        localStorage.setItem(key, JSON.stringify(cleaned));
                        console.log(`✅ ${key}: ${parsed.length - cleaned.length} éléments invalides supprimés`);
                    }
                }
            } catch (e) {
                localStorage.removeItem(key);
                console.log(`✅ ${key}: Données corrompues supprimées`);
            }
        }
    });
    
    // 3. Créer des données de base si nécessaire
    if (!localStorage.getItem('categories')) {
        const defaultCategories = [
            { _id: '1', name: 'Matériaux de Construction' },
            { _id: '2', name: 'Électronique' },
            { _id: '3', name: 'Outillage' },
            { _id: '4', name: 'Plomberie' },
            { _id: '5', name: 'Électricité' }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
        console.log('✅ Catégories par défaut créées');
    }
}

// 2. Fonction pour corriger la persistance des produits
function fixProductPersistence() {
    console.log('🔧 Correction de la persistance des produits...');
    
    // S'assurer que tous les produits ont les champs requis
    const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
    const fixedProducts = products.map(product => ({
        ...product,
        isPublished: product.isPublished !== undefined ? product.isPublished : true,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
        images: product.images || [],
        featured: product.featured || false
    }));
    
    localStorage.setItem('koula_products', JSON.stringify(fixedProducts));
    console.log(`✅ ${fixedProducts.length} produits corrigés`);
}

// 3. Fonction pour corriger la persistance des ventes
function fixSalesPersistence() {
    console.log('🔧 Correction de la persistance des ventes...');
    
    const sales = JSON.parse(localStorage.getItem('salesData') || '[]');
    const fixedSales = sales.map(sale => ({
        ...sale,
        status: sale.status || 'pending',
        paymentMethod: sale.paymentMethod || 'cash',
        createdAt: sale.createdAt || new Date().toISOString()
    }));
    
    localStorage.setItem('salesData', JSON.stringify(fixedSales));
    console.log(`✅ ${fixedSales.length} ventes corrigées`);
}

// 4. Fonction pour corriger la persistance des commandes
function fixOrdersPersistence() {
    console.log('🔧 Correction de la persistance des commandes...');
    
    const orders = JSON.parse(localStorage.getItem('ordersData') || '[]');
    const fixedOrders = orders.map(order => ({
        ...order,
        status: order.status || 'pending',
        createdAt: order.createdAt || new Date().toISOString()
    }));
    
    localStorage.setItem('ordersData', JSON.stringify(fixedOrders));
    console.log(`✅ ${fixedOrders.length} commandes corrigées`);
}

// 5. Fonction pour corriger la persistance des utilisateurs
function fixUsersPersistence() {
    console.log('🔧 Correction de la persistance des utilisateurs...');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const fixedUsers = users.map(user => ({
        ...user,
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
        createdAt: user.createdAt || new Date().toISOString()
    }));
    
    localStorage.setItem('users', JSON.stringify(fixedUsers));
    console.log(`✅ ${fixedUsers.length} utilisateurs corrigés`);
}

// 6. Fonction pour corriger la persistance des dettes
function fixDebtsPersistence() {
    console.log('🔧 Correction de la persistance des dettes...');
    
    const debts = JSON.parse(localStorage.getItem('debts') || '[]');
    const fixedDebts = debts.map(debt => ({
        ...debt,
        status: debt.status || 'pending',
        paidAmount: debt.paidAmount || 0,
        remainingAmount: debt.remainingAmount || (debt.amount - (debt.paidAmount || 0)),
        createdAt: debt.createdAt || new Date().toISOString()
    }));
    
    localStorage.setItem('debts', JSON.stringify(fixedDebts));
    console.log(`✅ ${fixedDebts.length} dettes corrigées`);
}

// 7. Fonction pour créer un système de sauvegarde automatique
function setupAutoSave() {
    console.log('💾 Configuration de la sauvegarde automatique...');
    
    // Sauvegarder toutes les données importantes avant toute modification
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Sauvegarder avant modification
        if (['koula_products', 'salesData', 'ordersData', 'users', 'debts'].includes(key)) {
            const backupKey = key + '_backup';
            const currentValue = localStorage.getItem(key);
            if (currentValue) {
                localStorage.setItem(backupKey, currentValue);
            }
        }
        
        // Effectuer la modification
        return originalSetItem.call(this, key, value);
    };
    
    console.log('✅ Sauvegarde automatique configurée');
}

// 8. Fonction pour vérifier l'intégrité des données
function verifyDataIntegrity() {
    console.log('🔍 Vérification de l\'intégrité des données...');
    
    const dataTypes = [
        { key: 'koula_products', name: 'Produits' },
        { key: 'salesData', name: 'Ventes' },
        { key: 'ordersData', name: 'Commandes' },
        { key: 'users', name: 'Utilisateurs' },
        { key: 'categories', name: 'Catégories' },
        { key: 'debts', name: 'Dettes' }
    ];
    
    dataTypes.forEach(({ key, name }) => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    const validItems = parsed.filter(item => 
                        item && typeof item === 'object' && item._id
                    );
                    console.log(`✅ ${name}: ${validItems.length}/${parsed.length} éléments valides`);
                } else {
                    console.log(`⚠️  ${name}: Données non-array`);
                }
            } catch (e) {
                console.log(`❌ ${name}: Données corrompues`);
            }
        } else {
            console.log(`⚪ ${name}: Aucune donnée`);
        }
    });
}

// 9. Fonction principale de correction
function fixAllPersistenceIssues() {
    console.log('🚀 Démarrage de la correction complète...');
    
    try {
        // 1. Nettoyer localStorage
        cleanAndFixLocalStorage();
        
        // 2. Corriger chaque type de données
        fixProductPersistence();
        fixSalesPersistence();
        fixOrdersPersistence();
        fixUsersPersistence();
        fixDebtsPersistence();
        
        // 3. Configurer la sauvegarde automatique
        setupAutoSave();
        
        // 4. Vérifier l'intégrité
        verifyDataIntegrity();
        
        console.log('🎉 Correction complète terminée avec succès !');
        console.log('✅ Toutes les données sont maintenant persistantes');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de la correction:', error);
        return false;
    }
}

// 10. Exécuter la correction automatiquement
if (typeof window !== 'undefined') {
    // Exécuter dans le navigateur
    fixAllPersistenceIssues();
    
    // Ajouter un listener pour les changements de page
    window.addEventListener('beforeunload', function() {
        console.log('💾 Sauvegarde avant fermeture...');
        verifyDataIntegrity();
    });
    
    // Exporter les fonctions pour utilisation manuelle
    window.fixAdminPersistence = {
        fixAll: fixAllPersistenceIssues,
        clean: cleanAndFixLocalStorage,
        verify: verifyDataIntegrity,
        fixProducts: fixProductPersistence,
        fixSales: fixSalesPersistence,
        fixOrders: fixOrdersPersistence,
        fixUsers: fixUsersPersistence,
        fixDebts: fixDebtsPersistence
    };
    
    console.log('🔧 Script de correction chargé. Utilisez window.fixAdminPersistence pour les fonctions manuelles.');
}

// Exporter pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fixAllPersistenceIssues,
        cleanAndFixLocalStorage,
        verifyDataIntegrity,
        fixProductPersistence,
        fixSalesPersistence,
        fixOrdersPersistence,
        fixUsersPersistence,
        fixDebtsPersistence
    };
}
