// Script de migration pour corriger le problème de persistance des produits
// Ce script synchronise les données entre les anciennes et nouvelles clés de stockage

console.log('🔧 Début de la migration des produits...');

// Clés de stockage
const ADMIN_KEY = 'koula_products';
const OLD_CLIENT_KEY = 'adminProducts';

// Fonction pour migrer les données
function migrateProductData() {
  try {
    // Récupérer les données existantes
    const adminProducts = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    const oldClientProducts = JSON.parse(localStorage.getItem(OLD_CLIENT_KEY) || '[]');
    
    console.log(`📊 Produits dans ${ADMIN_KEY}: ${adminProducts.length}`);
    console.log(`📊 Produits dans ${OLD_CLIENT_KEY}: ${oldClientProducts.length}`);
    
    // Si il y a des produits dans l'ancienne clé, les migrer
    if (oldClientProducts.length > 0) {
      console.log('🔄 Migration des produits de l\'ancienne clé...');
      
      // Fusionner les produits (éviter les doublons)
      const existingIds = new Set(adminProducts.map(p => p._id));
      const newProducts = oldClientProducts.filter(p => !existingIds.has(p._id));
      
      const mergedProducts = [...adminProducts, ...newProducts];
      localStorage.setItem(ADMIN_KEY, JSON.stringify(mergedProducts));
      
      console.log(`✅ ${newProducts.length} produits migrés vers ${ADMIN_KEY}`);
      console.log(`📊 Total produits après migration: ${mergedProducts.length}`);
    }
    
    // Corriger la structure des produits si nécessaire
    const allProducts = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    let correctedCount = 0;
    
    const correctedProducts = allProducts.map(product => {
      const corrected = { ...product };
      
      // Corriger published -> isPublished
      if (product.hasOwnProperty('published') && !product.hasOwnProperty('isPublished')) {
        corrected.isPublished = product.published;
        delete corrected.published;
        correctedCount++;
      }
      
      // Corriger featured si nécessaire (garder la cohérence)
      if (!product.hasOwnProperty('featured') && product.hasOwnProperty('isFeatured')) {
        corrected.featured = product.isFeatured;
        delete corrected.isFeatured;
        correctedCount++;
      }
      
      return corrected;
    });
    
    if (correctedCount > 0) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(correctedProducts));
      console.log(`🔧 ${correctedCount} produits corrigés (structure)`);
    }
    
    // Nettoyer l'ancienne clé
    localStorage.removeItem(OLD_CLIENT_KEY);
    console.log('🗑️ Ancienne clé supprimée');
    
    console.log('✅ Migration terminée avec succès !');
    
    // Afficher le résumé
    const finalProducts = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    const publishedProducts = finalProducts.filter(p => p.isPublished === true);
    const featuredProducts = finalProducts.filter(p => p.featured === true);
    
    console.log('\n📋 Résumé final:');
    console.log(`- Total produits: ${finalProducts.length}`);
    console.log(`- Produits publiés: ${publishedProducts.length}`);
    console.log(`- Produits vedettes: ${featuredProducts.length}`);
    
    return {
      success: true,
      totalProducts: finalProducts.length,
      publishedProducts: publishedProducts.length,
      featuredProducts: featuredProducts.length
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exécuter la migration
const result = migrateProductData();

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  window.migrateProductData = migrateProductData;
  console.log('\n💡 Pour exécuter à nouveau la migration, utilisez: migrateProductData()');
}
