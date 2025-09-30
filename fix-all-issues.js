/**
 * Script de Correction Automatique - Koula E-commerce
 * Ce script corrige tous les problèmes identifiés dans le système
 */

console.log('🔧 Démarrage du script de correction automatique...');

// Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:3001/api',
    LOCAL_STORAGE_KEYS: {
        ORDERS: 'clientOrders',
        PRODUCTS: 'koula_products',
        USERS: 'users',
        CART: 'cart'
    }
};

/**
 * Classe principale pour la correction automatique
 */
class KoulaFixer {
    constructor() {
        this.fixesApplied = [];
        this.errors = [];
        this.startTime = Date.now();
    }

    /**
     * Exécuter toutes les corrections
     */
    async runAllFixes() {
        console.log('🚀 Lancement de toutes les corrections...');
        
        try {
            // 1. Vérifier la connexion API
            await this.checkAPIConnection();
            
            // 2. Corriger les données des commandes
            await this.fixOrdersData();
            
            // 3. Corriger les données des produits
            await this.fixProductsData();
            
            // 4. Corriger les données des utilisateurs
            await this.fixUsersData();
            
            // 5. Optimiser les performances
            await this.optimizePerformance();
            
            // 6. Nettoyer les données corrompues
            await this.cleanCorruptedData();
            
            // 7. Créer des données de test si nécessaire
            await this.createTestDataIfNeeded();
            
            // 8. Générer le rapport final
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'exécution des corrections:', error);
            this.errors.push(error.message);
        }
    }

    /**
     * Vérifier la connexion API
     */
    async checkAPIConnection() {
        console.log('🔍 Vérification de la connexion API...');
        
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/health`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ API connectée avec succès');
                this.fixesApplied.push('Connexion API vérifiée');
            } else {
                throw new Error('API non disponible');
            }
        } catch (error) {
            console.warn('⚠️ API non accessible, mode hors ligne activé');
            this.fixesApplied.push('Mode hors ligne activé (API non accessible)');
        }
    }

    /**
     * Corriger les données des commandes
     */
    async fixOrdersData() {
        console.log('📋 Correction des données des commandes...');
        
        try {
            let orders = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS) || '[]');
            let fixedCount = 0;
            
            // Corriger chaque commande
            orders = orders.map(order => {
                const fixedOrder = { ...order };
                
                // Corriger l'ID si manquant
                if (!fixedOrder._id) {
                    fixedOrder._id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    fixedCount++;
                }
                
                // Corriger le total si manquant
                if (!fixedOrder.totalAmount && fixedOrder.items) {
                    fixedOrder.totalAmount = fixedOrder.items.reduce((sum, item) => 
                        sum + (item.price * item.quantity), 0);
                    fixedCount++;
                }
                
                // Corriger le statut si manquant
                if (!fixedOrder.orderStatus) {
                    fixedOrder.orderStatus = 'pending';
                    fixedCount++;
                }
                
                // Corriger la date de création si manquante
                if (!fixedOrder.createdAt) {
                    fixedOrder.createdAt = new Date().toISOString();
                    fixedCount++;
                }
                
                // Corriger les items si manquants
                if (!fixedOrder.items || !Array.isArray(fixedOrder.items)) {
                    fixedOrder.items = [];
                    fixedCount++;
                }
                
                // Corriger les données utilisateur si manquantes
                if (!fixedOrder.user) {
                    fixedOrder.user = {
                        firstName: 'Client',
                        lastName: 'Inconnu',
                        email: 'client@example.com'
                    };
                    fixedCount++;
                }
                
                return fixedOrder;
            });
            
            // Sauvegarder les commandes corrigées
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            
            console.log(`✅ Commandes corrigées: ${fixedCount} corrections appliquées sur ${orders.length} commandes`);
            this.fixesApplied.push(`Commandes: ${fixedCount} corrections sur ${orders.length} commandes`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la correction des commandes:', error);
            this.errors.push(`Erreur commandes: ${error.message}`);
        }
    }

    /**
     * Corriger les données des produits
     */
    async fixProductsData() {
        console.log('📦 Correction des données des produits...');
        
        try {
            let products = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
            let fixedCount = 0;
            
            // Corriger chaque produit
            products = products.map(product => {
                const fixedProduct = { ...product };
                
                // Corriger l'ID si manquant
                if (!fixedProduct._id) {
                    fixedProduct._id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    fixedCount++;
                }
                
                // Corriger le nom si manquant
                if (!fixedProduct.name) {
                    fixedProduct.name = 'Produit sans nom';
                    fixedCount++;
                }
                
                // Corriger le prix si manquant ou invalide
                if (typeof fixedProduct.price !== 'number' || fixedProduct.price < 0) {
                    fixedProduct.price = 0;
                    fixedCount++;
                }
                
                // Corriger le stock si manquant ou invalide
                if (typeof fixedProduct.stock !== 'number' || fixedProduct.stock < 0) {
                    fixedProduct.stock = 0;
                    fixedCount++;
                }
                
                // Corriger le type de produit si manquant
                if (!fixedProduct.productType) {
                    fixedProduct.productType = 'general';
                    fixedCount++;
                }
                
                // Corriger la date de création si manquante
                if (!fixedProduct.createdAt) {
                    fixedProduct.createdAt = new Date().toISOString();
                    fixedCount++;
                }
                
                return fixedProduct;
            });
            
            // Sauvegarder les produits corrigés
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
            
            console.log(`✅ Produits corrigés: ${fixedCount} corrections appliquées sur ${products.length} produits`);
            this.fixesApplied.push(`Produits: ${fixedCount} corrections sur ${products.length} produits`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la correction des produits:', error);
            this.errors.push(`Erreur produits: ${error.message}`);
        }
    }

    /**
     * Corriger les données des utilisateurs
     */
    async fixUsersData() {
        console.log('👥 Correction des données des utilisateurs...');
        
        try {
            let users = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USERS) || '[]');
            let fixedCount = 0;
            
            // Corriger chaque utilisateur
            users = users.map(user => {
                const fixedUser = { ...user };
                
                // Corriger l'ID si manquant
                if (!fixedUser._id) {
                    fixedUser._id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    fixedCount++;
                }
                
                // Corriger le nom si manquant
                if (!fixedUser.firstName) {
                    fixedUser.firstName = 'Utilisateur';
                    fixedCount++;
                }
                
                if (!fixedUser.lastName) {
                    fixedUser.lastName = 'Inconnu';
                    fixedCount++;
                }
                
                // Corriger l'email si manquant
                if (!fixedUser.email) {
                    fixedUser.email = `user_${Date.now()}@example.com`;
                    fixedCount++;
                }
                
                return fixedUser;
            });
            
            // Sauvegarder les utilisateurs corrigés
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
            
            console.log(`✅ Utilisateurs corrigés: ${fixedCount} corrections appliquées sur ${users.length} utilisateurs`);
            this.fixesApplied.push(`Utilisateurs: ${fixedCount} corrections sur ${users.length} utilisateurs`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la correction des utilisateurs:', error);
            this.errors.push(`Erreur utilisateurs: ${error.message}`);
        }
    }

    /**
     * Optimiser les performances
     */
    async optimizePerformance() {
        console.log('⚡ Optimisation des performances...');
        
        try {
            let optimizedCount = 0;
            
            // Nettoyer les données temporaires
            const tempKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('temp_') || key.includes('cache_') || key.includes('_temp'))) {
                    tempKeys.push(key);
                }
            }
            
            tempKeys.forEach(key => {
                localStorage.removeItem(key);
                optimizedCount++;
            });
            
            // Optimiser les données des commandes
            const orders = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS) || '[]');
            const optimizedOrders = orders.map(order => ({
                _id: order._id,
                user: order.user ? {
                    firstName: order.user.firstName,
                    lastName: order.user.lastName,
                    email: order.user.email
                } : null,
                items: order.items,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt
            }));
            
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(optimizedOrders));
            optimizedCount++;
            
            console.log(`✅ Optimisation terminée: ${optimizedCount} optimisations appliquées`);
            this.fixesApplied.push(`Optimisation: ${optimizedCount} optimisations appliquées`);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'optimisation:', error);
            this.errors.push(`Erreur optimisation: ${error.message}`);
        }
    }

    /**
     * Nettoyer les données corrompues
     */
    async cleanCorruptedData() {
        console.log('🧹 Nettoyage des données corrompues...');
        
        try {
            let cleanedCount = 0;
            
            // Nettoyer les commandes corrompues
            const orders = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS) || '[]');
            const cleanOrders = orders.filter(order => {
                // Garder seulement les commandes avec des données valides
                return order && 
                       typeof order === 'object' && 
                       (order._id || order.user || order.items);
            });
            
            if (cleanOrders.length !== orders.length) {
                localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(cleanOrders));
                cleanedCount += (orders.length - cleanOrders.length);
            }
            
            // Nettoyer les produits corrompus
            const products = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
            const cleanProducts = products.filter(product => {
                // Garder seulement les produits avec des données valides
                return product && 
                       typeof product === 'object' && 
                       (product._id || product.name);
            });
            
            if (cleanProducts.length !== products.length) {
                localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(cleanProducts));
                cleanedCount += (products.length - cleanProducts.length);
            }
            
            console.log(`✅ Nettoyage terminé: ${cleanedCount} éléments corrompus supprimés`);
            this.fixesApplied.push(`Nettoyage: ${cleanedCount} éléments corrompus supprimés`);
            
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage:', error);
            this.errors.push(`Erreur nettoyage: ${error.message}`);
        }
    }

    /**
     * Créer des données de test si nécessaire
     */
    async createTestDataIfNeeded() {
        console.log('🧪 Création de données de test si nécessaire...');
        
        try {
            let createdCount = 0;
            
            // Vérifier les commandes
            const orders = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS) || '[]');
            if (orders.length === 0) {
                const testOrders = [
                    {
                        _id: 'test_order_1',
                        user: {
                            firstName: 'Mamadou',
                            lastName: 'Diallo',
                            email: 'mamadou@example.com'
                        },
                        items: [
                            {
                                name: 'Ciment Portland',
                                price: 50000,
                                quantity: 2
                            }
                        ],
                        totalAmount: 100000,
                        orderStatus: 'delivered',
                        createdAt: new Date(Date.now() - 86400000).toISOString() // Il y a 1 jour
                    },
                    {
                        _id: 'test_order_2',
                        user: {
                            firstName: 'Fatou',
                            lastName: 'Camara',
                            email: 'fatou@example.com'
                        },
                        items: [
                            {
                                name: 'Téléphone Samsung',
                                price: 250000,
                                quantity: 1
                            }
                        ],
                        totalAmount: 250000,
                        orderStatus: 'pending',
                        createdAt: new Date().toISOString()
                    }
                ];
                
                localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(testOrders));
                createdCount += testOrders.length;
            }
            
            // Vérifier les produits
            const products = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
            if (products.length === 0) {
                const testProducts = [
                    {
                        _id: 'test_product_1',
                        name: 'Ciment Portland',
                        price: 50000,
                        stock: 10,
                        productType: 'construction',
                        createdAt: new Date().toISOString()
                    },
                    {
                        _id: 'test_product_2',
                        name: 'Téléphone Samsung',
                        price: 250000,
                        stock: 5,
                        productType: 'electronics',
                        createdAt: new Date().toISOString()
                    }
                ];
                
                localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(testProducts));
                createdCount += testProducts.length;
            }
            
            console.log(`✅ Données de test créées: ${createdCount} éléments`);
            this.fixesApplied.push(`Données de test: ${createdCount} éléments créés`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la création des données de test:', error);
            this.errors.push(`Erreur données de test: ${error.message}`);
        }
    }

    /**
     * Générer le rapport final
     */
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('📊 === RAPPORT DE CORRECTION ===');
        console.log(`⏱️ Durée: ${duration}ms`);
        console.log(`✅ Corrections appliquées: ${this.fixesApplied.length}`);
        console.log(`❌ Erreurs: ${this.errors.length}`);
        
        console.log('\n📋 Détail des corrections:');
        this.fixesApplied.forEach((fix, index) => {
            console.log(`  ${index + 1}. ${fix}`);
        });
        
        if (this.errors.length > 0) {
            console.log('\n❌ Erreurs rencontrées:');
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎉 Correction terminée !');
        
        // Afficher un résumé dans l'interface si possible
        if (typeof document !== 'undefined') {
            const summary = `
                <div style="position: fixed; top: 20px; right: 20px; background: #27ae60; color: white; padding: 20px; border-radius: 10px; z-index: 10000; max-width: 300px;">
                    <h3>✅ Correction Terminée</h3>
                    <p><strong>Corrections:</strong> ${this.fixesApplied.length}</p>
                    <p><strong>Erreurs:</strong> ${this.errors.length}</p>
                    <p><strong>Durée:</strong> ${duration}ms</p>
                    <button onclick="this.parentElement.remove()" style="background: white; color: #27ae60; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Fermer</button>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', summary);
            
            // Supprimer automatiquement après 10 secondes
            setTimeout(() => {
                const notification = document.querySelector('[style*="position: fixed"]');
                if (notification) notification.remove();
            }, 10000);
        }
    }
}

/**
 * Fonction principale pour exécuter les corrections
 */
async function runKoulaFixes() {
    const fixer = new KoulaFixer();
    await fixer.runAllFixes();
    return fixer;
}

/**
 * Fonction pour corriger un problème spécifique
 */
async function fixSpecificIssue(issueType) {
    const fixer = new KoulaFixer();
    
    switch (issueType) {
        case 'orders':
            await fixer.fixOrdersData();
            break;
        case 'products':
            await fixer.fixProductsData();
            break;
        case 'users':
            await fixer.fixUsersData();
            break;
        case 'performance':
            await fixer.optimizePerformance();
            break;
        case 'cleanup':
            await fixer.cleanCorruptedData();
            break;
        default:
            console.warn('Type de problème non reconnu:', issueType);
    }
    
    return fixer;
}

/**
 * Fonction pour vérifier l'état du système
 */
function checkSystemHealth() {
    const health = {
        orders: 0,
        products: 0,
        users: 0,
        issues: []
    };
    
    try {
        const orders = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ORDERS) || '[]');
        const products = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.PRODUCTS) || '[]');
        const users = JSON.parse(localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USERS) || '[]');
        
        health.orders = orders.length;
        health.products = products.length;
        health.users = users.length;
        
        // Vérifier les problèmes
        orders.forEach(order => {
            if (!order._id) health.issues.push('Commande sans ID');
            if (!order.user) health.issues.push('Commande sans utilisateur');
            if (!order.items || order.items.length === 0) health.issues.push('Commande sans articles');
        });
        
        products.forEach(product => {
            if (!product._id) health.issues.push('Produit sans ID');
            if (!product.name) health.issues.push('Produit sans nom');
            if (typeof product.price !== 'number') health.issues.push('Produit avec prix invalide');
        });
        
    } catch (error) {
        health.issues.push(`Erreur de lecture: ${error.message}`);
    }
    
    return health;
}

// Exporter les fonctions pour utilisation globale
if (typeof window !== 'undefined') {
    window.KoulaFixer = KoulaFixer;
    window.runKoulaFixes = runKoulaFixes;
    window.fixSpecificIssue = fixSpecificIssue;
    window.checkSystemHealth = checkSystemHealth;
}

// Auto-exécution si le script est chargé directement
if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔧 Script de correction chargé. Utilisez runKoulaFixes() pour démarrer.');
    });
} else if (typeof document !== 'undefined') {
    console.log('🔧 Script de correction chargé. Utilisez runKoulaFixes() pour démarrer.');
}

console.log('✅ Script de correction automatique chargé avec succès !');
