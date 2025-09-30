/**
 * SCRIPT DE NETTOYAGE FORCÉ - SUPPRIME TOUTES LES DONNÉES DE TEST
 * 
 * ⚠️ ATTENTION: Ce script supprime TOUTES les données stockées localement
 * 
 * Copiez-collez ce code dans la console de votre navigateur (F12 → Console)
 * pour supprimer définitivement toutes les données de test
 */

console.log('🧹 NETTOYAGE FORCÉ DE TOUTES LES DONNÉES...');
console.log('⚠️  ATTENTION: Toutes les données seront supprimées !');

// Liste de toutes les clés à supprimer
const keysToDelete = [
  // Commandes
  'clientOrders',
  'orders', 
  'adminOrders',
  'testOrders',
  'demoOrders',
  
  // Produits
  'koula_products',
  'adminProducts', 
  'products',
  'testProducts',
  'demoProducts',
  
  // Mouvements de stock
  'stockMovements',
  'testStockMovements',
  'demoStockMovements',
  'movements',
  
  // Autres données
  'salesData',
  'testSalesData',
  'demoSalesData',
  'inventory',
  'testInventory',
  'demoInventory',
  'categories',
  'testCategories',
  'demoCategories',
  'users',
  'testUsers',
  'demoUsers'
];

// Supprimer toutes les clés
let deletedCount = 0;
keysToDelete.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    deletedCount++;
    console.log(`✅ Supprimé: ${key}`);
  }
});

// Supprimer aussi toutes les autres clés qui pourraient contenir des données
Object.keys(localStorage).forEach(key => {
  if (!keysToDelete.includes(key)) {
    localStorage.removeItem(key);
    deletedCount++;
    console.log(`✅ Supprimé: ${key}`);
  }
});

console.log(`\n🎉 NETTOYAGE TERMINÉ !`);
console.log(`📊 ${deletedCount} éléments supprimés`);
console.log(`\n💡 MAINTENANT:`);
console.log('- Actualisez la page');
console.log('- Les données de test ne reviendront plus');
console.log('- L'interface sera vide et prête pour vos vraies données');

// Vérifier l'état final
console.log(`\n📋 ÉTAT FINAL:`);
console.log(`- Éléments restants dans localStorage: ${Object.keys(localStorage).length}`);
console.log(`- Toutes les données de test ont été supprimées !`);

console.log('\n🔄 Actualisez maintenant la page pour voir le résultat !');
