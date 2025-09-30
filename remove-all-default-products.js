// Script pour supprimer TOUS les produits par défaut et données de démonstration
// Ce script nettoie complètement l'application pour un test à partir de zéro

console.log('🧹 Suppression complète de tous les produits par défaut...');

// Toutes les clés de stockage possibles
const ALL_STORAGE_KEYS = [
  'koula_products',
  'adminProducts',
  'products',
  'demo_products',
  'test_products',
  'sample_products',
  'default_products',
  'construction_products',
  'electronics_products',
  'featured_products',
  'local_products',
  'admin_products',
  'client_products'
];

// Fonction pour nettoyer complètement
function removeAllDefaultProducts() {
  try {
    console.log('🔍 Recherche de toutes les données de produits...');
    
    let foundKeys = [];
    let removedCount = 0;
    
    // Nettoyer localStorage
    ALL_STORAGE_KEYS.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.removeItem(key);
            foundKeys.push(key);
            removedCount += parsed.length;
            console.log(`🗑️ Supprimé ${parsed.length} produits de: ${key}`);
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
    ALL_STORAGE_KEYS.forEach(key => {
      const data = sessionStorage.getItem(key);
      if (data) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Supprimé (session): ${key}`);
      }
    });
    
    // Nettoyer aussi les clés avec des variantes
    const allLocalStorageKeys = Object.keys(localStorage);
    allLocalStorageKeys.forEach(key => {
      if (key.toLowerCase().includes('product') || 
          key.toLowerCase().includes('admin') || 
          key.toLowerCase().includes('koula') ||
          key.toLowerCase().includes('demo') ||
          key.toLowerCase().includes('test')) {
        localStorage.removeItem(key);
        console.log(`🗑️ Supprimé clé suspecte: ${key}`);
      }
    });
    
    console.log('\n✅ Nettoyage terminé !');
    console.log(`📊 Clés trouvées et supprimées: ${foundKeys.length}`);
    console.log(`📊 Produits supprimés: ${removedCount}`);
    
    if (foundKeys.length > 0) {
      console.log('\n🗑️ Clés supprimées:');
      foundKeys.forEach(key => console.log(`   - ${key}`));
    }
    
    // Vérification finale
    const remainingProducts = ALL_STORAGE_KEYS.filter(key => {
      const data = localStorage.getItem(key);
      return data && data !== '[]' && data !== 'null';
    });
    
    if (remainingProducts.length === 0) {
      console.log('\n✅ Interface complètement vide - prête pour vos tests !');
      console.log('\n📋 Instructions:');
      console.log('1. Actualisez la page (F5)');
      console.log('2. L\'interface admin sera vide');
      console.log('3. Les pages client n\'afficheront aucun produit');
      console.log('4. Vous pouvez maintenant tester en ajoutant vos propres produits');
    } else {
      console.log('\n⚠️ Clés restantes:', remainingProducts);
    }
    
    return {
      success: true,
      removedKeys: foundKeys,
      removedProducts: removedCount,
      remainingKeys: remainingProducts
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
const result = removeAllDefaultProducts();

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.removeAllDefaultProducts = removeAllDefaultProducts;
  console.log('\n💡 Pour nettoyer à nouveau, utilisez: removeAllDefaultProducts()');
}
