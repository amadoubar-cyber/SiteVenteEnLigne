// Script de nettoyage IMMÉDIAT et FORCÉ des données de stock
// Exécutez ce script dans la console du navigateur pour supprimer TOUTES les données

console.log('🚨 NETTOYAGE FORCÉ DES DONNÉES DE STOCK...');

// Supprimer IMMÉDIATEMENT toutes les clés de stock
const keysToDelete = [
  'stockMovements',
  'adminProducts',
  'koula_products',
  'stock_movements',
  'productStocks',
  'stock_data',
  'movements_data',
  'demo_stock',
  'test_movements',
  'stock_demo',
  'movements_demo',
  'stock_test',
  'movements_test',
  'clientOrders',
  'productComments'
];

console.log('🗑️ Suppression de toutes les clés de stock...');

keysToDelete.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Supprimé: ${key}`);
  }
});

// Supprimer aussi toutes les clés qui contiennent "stock", "movement", "product", "admin"
Object.keys(localStorage).forEach(key => {
  if (key.toLowerCase().includes('stock') || 
      key.toLowerCase().includes('movement') || 
      key.toLowerCase().includes('product') || 
      key.toLowerCase().includes('admin') ||
      key.toLowerCase().includes('demo') ||
      key.toLowerCase().includes('test')) {
    localStorage.removeItem(key);
    console.log(`✅ Supprimé clé suspecte: ${key}`);
  }
});

console.log('✅ NETTOYAGE TERMINÉ !');
console.log('🔄 ACTUALISEZ MAINTENANT LA PAGE (F5)');

// Vérification finale
const remainingKeys = Object.keys(localStorage).filter(key => 
  key.toLowerCase().includes('stock') || 
  key.toLowerCase().includes('movement') || 
  key.toLowerCase().includes('product') || 
  key.toLowerCase().includes('admin')
);

if (remainingKeys.length === 0) {
  console.log('🎉 SUCCÈS ! Toutes les données de stock ont été supprimées !');
  console.log('📋 Instructions:');
  console.log('1. Actualisez la page maintenant (F5)');
  console.log('2. L\'interface sera complètement vide');
  console.log('3. Vous pourrez ajouter vos propres produits');
} else {
  console.log('⚠️ Clés restantes:', remainingKeys);
  console.log('💡 Supprimez-les manuellement si nécessaire');
}

// Message d'urgence
alert('NETTOYAGE TERMINÉ ! Actualisez la page maintenant (F5) pour voir l\'interface vide.');
