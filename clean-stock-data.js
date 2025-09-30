// Script pour nettoyer toutes les données de stock et mouvements
// Ce script supprime toutes les données de démonstration du système de stock

console.log('🧹 Nettoyage des données de stock et mouvements...');

// Clés de stockage liées au stock
const STOCK_STORAGE_KEYS = [
  'stockMovements',
  'stock_movements',
  'adminProducts',
  'productStocks',
  'stock_data',
  'movements_data',
  'demo_stock',
  'test_movements',
  'stock_demo',
  'movements_demo',
  'stock_test',
  'movements_test'
];

// Fonction pour nettoyer les données de stock
function cleanStockData() {
  try {
    console.log('🔍 Recherche de données de stock...');
    
    let foundKeys = [];
    let removedCount = 0;
    
    // Nettoyer localStorage
    STOCK_STORAGE_KEYS.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.removeItem(key);
            foundKeys.push(key);
            removedCount += parsed.length;
            console.log(`🗑️ Supprimé ${parsed.length} éléments de: ${key}`);
          } else if (typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            localStorage.removeItem(key);
            foundKeys.push(key);
            console.log(`🗑️ Supprimé données objet de: ${key}`);
          }
        } catch (e) {
          // Si ce n'est pas du JSON valide, le supprimer quand même
          localStorage.removeItem(key);
          foundKeys.push(key);
          console.log(`🗑️ Supprimé données non-JSON de: ${key}`);
        }
      }
    });
    
    // Nettoyer sessionStorage aussi
    STOCK_STORAGE_KEYS.forEach(key => {
      const data = sessionStorage.getItem(key);
      if (data) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Supprimé (session): ${key}`);
      }
    });
    
    // Nettoyer aussi les clés avec des variantes
    const allLocalStorageKeys = Object.keys(localStorage);
    allLocalStorageKeys.forEach(key => {
      if (key.toLowerCase().includes('stock') || 
          key.toLowerCase().includes('movement') || 
          key.toLowerCase().includes('adminproducts')) {
        localStorage.removeItem(key);
        console.log(`🗑️ Supprimé clé suspecte: ${key}`);
      }
    });
    
    console.log('\n✅ Nettoyage terminé !');
    console.log(`📊 Clés trouvées et supprimées: ${foundKeys.length}`);
    console.log(`📊 Éléments supprimés: ${removedCount}`);
    
    if (foundKeys.length > 0) {
      console.log('\n🗑️ Clés supprimées:');
      foundKeys.forEach(key => console.log(`   - ${key}`));
    }
    
    // Vérification finale
    const remainingStock = STOCK_STORAGE_KEYS.filter(key => {
      const data = localStorage.getItem(key);
      return data && data !== '[]' && data !== 'null' && data !== '{}';
    });
    
    if (remainingStock.length === 0) {
      console.log('\n✅ Interface stock complètement vide - prête pour vos données !');
      console.log('\n📋 Instructions:');
      console.log('1. Actualisez la page (F5)');
      console.log('2. L\'interface "Mouvements de Stock" sera vide');
      console.log('3. Vous pouvez maintenant ajouter vos propres produits et mouvements');
      console.log('4. Toutes les statistiques seront basées sur vos vraies données');
    } else {
      console.log('\n⚠️ Clés restantes:', remainingStock);
    }
    
    return {
      success: true,
      removedKeys: foundKeys,
      removedItems: removedCount,
      remainingKeys: remainingStock
    };
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exécuter le nettoyage
const result = cleanStockData();

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.cleanStockData = cleanStockData;
  console.log('\n💡 Pour nettoyer à nouveau, utilisez: cleanStockData()');
}
