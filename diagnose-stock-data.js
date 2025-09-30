/**
 * Script de diagnostic des données de stock et commandes
 * 
 * Ce script affiche toutes les données stockées pour identifier
 * les sources du chiffre d'affaires incorrect
 */

console.log('🔍 DIAGNOSTIC DES DONNÉES DE STOCK ET COMMANDES');
console.log('='.repeat(50));

// Vérifier les commandes
const clientOrders = localStorage.getItem('clientOrders');
const orders = localStorage.getItem('orders');
const adminOrders = localStorage.getItem('adminOrders');

console.log('\n📦 COMMANDES:');
console.log('- clientOrders:', clientOrders ? `${JSON.parse(clientOrders).length} commandes` : 'Aucune');
console.log('- orders:', orders ? `${JSON.parse(orders).length} commandes` : 'Aucune');
console.log('- adminOrders:', adminOrders ? `${JSON.parse(adminOrders).length} commandes` : 'Aucune');

// Afficher les détails des commandes si elles existent
if (clientOrders) {
  const ordersData = JSON.parse(clientOrders);
  console.log('\n💰 DÉTAIL DES COMMANDES CLIENT:');
  ordersData.forEach((order, index) => {
    console.log(`Commande ${index + 1}:`, {
      id: order._id || order.id,
      total: order.total,
      date: order.createdAt || order.date,
      items: order.items?.length || 0
    });
  });
  
  // Calculer le total
  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
  console.log(`\n💵 TOTAL CHIFFRE D'AFFAIRES: ${totalRevenue.toLocaleString('fr-FR')} GNF`);
}

// Vérifier les produits
const koulaProducts = localStorage.getItem('koula_products');
const adminProducts = localStorage.getItem('adminProducts');

console.log('\n📋 PRODUITS:');
console.log('- koula_products:', koulaProducts ? `${JSON.parse(koulaProducts).length} produits` : 'Aucun');
console.log('- adminProducts:', adminProducts ? `${JSON.parse(adminProducts).length} produits` : 'Aucun');

// Vérifier les mouvements de stock
const stockMovements = localStorage.getItem('stockMovements');
console.log('\n📈 MOUVEMENTS DE STOCK:');
console.log('- stockMovements:', stockMovements ? `${JSON.parse(stockMovements).length} mouvements` : 'Aucun');

// Vérifier toutes les clés localStorage
console.log('\n🗂️ TOUTES LES CLÉS LOCALSTORAGE:');
Object.keys(localStorage).forEach(key => {
  const value = localStorage.getItem(key);
  if (value && value.length > 100) {
    console.log(`- ${key}: ${value.length} caractères`);
  } else {
    console.log(`- ${key}: ${value}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('✅ Diagnostic terminé !');
