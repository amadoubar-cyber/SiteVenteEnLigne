/**
 * SCRIPT DE NETTOYAGE - CORRECTION DU CHIFFRE D'AFFAIRES
 * 
 * Ce script supprime toutes les commandes de test qui faussent
 * le calcul du chiffre d'affaires dans le tableau de bord
 */

console.log('🧹 NETTOYAGE DES COMMANDES - CORRECTION DU CHIFFRE D\'AFFAIRES...');

// Vérifier les données actuelles
const clientOrders = localStorage.getItem('clientOrders');
if (clientOrders) {
  const orders = JSON.parse(clientOrders);
  console.log(`📊 Commandes trouvées: ${orders.length}`);
  
  let totalRevenue = 0;
  orders.forEach((order, index) => {
    const amount = order.totalAmount || order.total || 0;
    totalRevenue += amount;
    console.log(`- ${order.orderNumber || order.id}: ${amount.toLocaleString('fr-FR')} FG (${order.status})`);
  });
  console.log(`💰 Total actuel: ${totalRevenue.toLocaleString('fr-FR')} FG`);
}

// Supprimer toutes les commandes de test
const keysToClean = [
  'clientOrders',
  'orders', 
  'adminOrders',
  'testOrders',
  'demoOrders'
];

let deletedCount = 0;
keysToClean.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    deletedCount++;
    console.log(`✅ Supprimé: ${key}`);
  }
});

console.log(`\n🎉 NETTOYAGE TERMINÉ !`);
console.log(`📊 ${deletedCount} types de commandes supprimés`);

// Vérifier l'état après nettoyage
const remainingOrders = localStorage.getItem('clientOrders');
console.log(`📊 Commandes restantes: ${remainingOrders ? 'Oui' : 'Aucune'}`);

console.log('\n💡 MAINTENANT:');
console.log('- Actualisez le tableau de bord');
console.log('- Le chiffre d\'affaires devrait afficher 0 FG');
console.log('- Les statistiques seront correctes');

console.log('\n🔄 Actualisez maintenant le tableau de bord !');
