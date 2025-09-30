// Script pour nettoyer complètement tous les produits de démonstration
// et redémarrer avec une interface admin vide

console.log('🧹 Nettoyage complet des produits de démonstration...');

// Clés de stockage à nettoyer
const STORAGE_KEYS = [
  'koula_products',
  'adminProducts', 
  'products',
  'demo_products',
  'test_products'
];

// Fonction pour nettoyer toutes les données
function cleanAllProducts() {
  try {
    let cleanedKeys = [];
    
    // Nettoyer toutes les clés de stockage
    STORAGE_KEYS.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        localStorage.removeItem(key);
        cleanedKeys.push(key);
        console.log(`🗑️ Supprimé: ${key}`);
      }
    });
    
    // Nettoyer aussi sessionStorage au cas où
    STORAGE_KEYS.forEach(key => {
      const data = sessionStorage.getItem(key);
      if (data) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Supprimé (session): ${key}`);
      }
    });
    
    console.log(`✅ Nettoyage terminé ! ${cleanedKeys.length} clés supprimées`);
    
    // Vérifier que tout est bien vide
    const remainingData = STORAGE_KEYS.filter(key => localStorage.getItem(key) !== null);
    
    if (remainingData.length === 0) {
      console.log('✅ Interface admin complètement vide - prête pour vos propres produits !');
    } else {
      console.log('⚠️ Clés restantes:', remainingData);
    }
    
    // Instructions pour l'utilisateur
    console.log('\n📋 Instructions:');
    console.log('1. Actualisez la page (F5)');
    console.log('2. Connectez-vous à l\'interface admin');
    console.log('3. Ajoutez vos propres produits');
    console.log('4. Les clients verront uniquement vos produits');
    
    return {
      success: true,
      cleanedKeys: cleanedKeys,
      remainingKeys: remainingData
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
const result = cleanAllProducts();

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.cleanAllProducts = cleanAllProducts;
  console.log('\n💡 Pour nettoyer à nouveau, utilisez: cleanAllProducts()');
}
