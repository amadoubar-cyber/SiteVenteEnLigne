/**
 * Script de nettoyage des données de commandes de test
 * 
 * Ce script supprime toutes les données de commandes de test
 * pour permettre un calcul correct du chiffre d'affaires
 */

console.log('🧹 Nettoyage des données de commandes...');

// Supprimer toutes les commandes de test
localStorage.removeItem('clientOrders');
localStorage.removeItem('orders');
localStorage.removeItem('testOrders');
localStorage.removeItem('demoOrders');

// Vérifier et nettoyer d'autres clés potentielles
const keysToClean = [
  'adminOrders',
  'stockMovements',
  'testStockMovements',
  'demoStockMovements',
  'salesData',
  'testSalesData'
];

keysToClean.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Supprimé: ${key}`);
  }
});

// Vérifier l'état après nettoyage
const remainingOrders = localStorage.getItem('clientOrders');
console.log('📊 État après nettoyage:');
console.log('- Commandes client:', remainingOrders ? 'Données présentes' : 'Aucune donnée');
console.log('- Produits:', localStorage.getItem('koula_products') ? 'Produits présents' : 'Aucun produit');

console.log('🎉 Nettoyage terminé !');
console.log('💡 Le chiffre d\'affaires devrait maintenant afficher 0 ou les vraies données');
