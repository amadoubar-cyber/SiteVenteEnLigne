/**
 * Script de diagnostic pour le chiffre d'affaires du tableau de bord
 * 
 * Ce script examine les données qui affectent le calcul du chiffre d'affaires
 */

console.log('🔍 DIAGNOSTIC DU CHIFFRE D\'AFFAIRES - TABLEAU DE BORD');
console.log('='.repeat(60));

// Vérifier les commandes dans localStorage
const clientOrders = localStorage.getItem('clientOrders');
console.log('\n📦 COMMANDES CLIENT (localStorage):');
if (clientOrders) {
  const orders = JSON.parse(clientOrders);
  console.log(`- Nombre de commandes: ${orders.length}`);
  
  if (orders.length > 0) {
    console.log('\n📋 DÉTAIL DES COMMANDES:');
    let totalRevenue = 0;
    orders.forEach((order, index) => {
      const amount = order.totalAmount || order.total || 0;
      totalRevenue += amount;
      console.log(`Commande ${index + 1}:`, {
        id: order.id || order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalAmount: amount,
        status: order.status,
        date: order.createdAt || order.date
      });
    });
    console.log(`\n💰 TOTAL CALCULÉ: ${totalRevenue.toLocaleString('fr-FR')} FG`);
  }
} else {
  console.log('- Aucune commande trouvée');
}

// Vérifier les autres clés de commandes
const otherOrderKeys = ['orders', 'adminOrders', 'testOrders', 'demoOrders'];
otherOrderKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`\n📦 ${key.toUpperCase()}:`);
        console.log(`- Nombre de commandes: ${parsed.length}`);
        let total = 0;
        parsed.forEach(order => {
          total += order.totalAmount || order.total || 0;
        });
        console.log(`- Total: ${total.toLocaleString('fr-FR')} FG`);
      }
    } catch (e) {
      console.log(`- ${key}: Données non-JSON`);
    }
  }
});

// Vérifier les produits
const koulaProducts = localStorage.getItem('koula_products');
console.log('\n📋 PRODUITS:');
if (koulaProducts) {
  const products = JSON.parse(koulaProducts);
  console.log(`- Nombre de produits: ${products.length}`);
} else {
  console.log('- Aucun produit trouvé');
}

// Vérifier les utilisateurs
const users = localStorage.getItem('users');
console.log('\n👥 UTILISATEURS:');
if (users) {
  const usersData = JSON.parse(users);
  console.log(`- Nombre d'utilisateurs: ${usersData.length}`);
} else {
  console.log('- Aucun utilisateur trouvé');
}

// Vérifier toutes les clés localStorage
console.log('\n🗂️ TOUTES LES CLÉS LOCALSTORAGE:');
Object.keys(localStorage).forEach(key => {
  const value = localStorage.getItem(key);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      console.log(`- ${key}: ${parsed.length} éléments`);
    } else {
      console.log(`- ${key}: ${value.length} caractères`);
    }
  } catch {
    console.log(`- ${key}: ${value.length} caractères`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ Diagnostic terminé !');
console.log('\n💡 Si vous voyez des commandes avec des montants élevés,');
console.log('   ce sont probablement des données de test qui faussent les calculs.');
