/**
 * Script de diagnostic spécifique pour les données de mouvements de stock
 * 
 * Ce script examine spécifiquement les données de mouvements de stock
 * pour identifier d'où viennent les données de "Ciment Portland" et "Téléphone Samsung"
 */

console.log('🔍 DIAGNOSTIC SPÉCIFIQUE - MOUVEMENTS DE STOCK');
console.log('='.repeat(60));

// Vérifier les mouvements de stock
const stockMovements = localStorage.getItem('stockMovements');
console.log('\n📦 MOUVEMENTS DE STOCK:');
if (stockMovements) {
  const movements = JSON.parse(stockMovements);
  console.log(`- Nombre de mouvements: ${movements.length}`);
  
  if (movements.length > 0) {
    console.log('\n📋 DÉTAIL DES MOUVEMENTS:');
    movements.forEach((movement, index) => {
      console.log(`Mouvement ${index + 1}:`, {
        id: movement.id,
        productName: movement.productName,
        type: movement.type,
        quantity: movement.quantity,
        date: movement.date,
        reason: movement.reason,
        notes: movement.notes,
        supplier: movement.supplier
      });
    });
  }
} else {
  console.log('- Aucun mouvement de stock trouvé');
}

// Vérifier les produits
const koulaProducts = localStorage.getItem('koula_products');
console.log('\n📋 PRODUITS:');
if (koulaProducts) {
  const products = JSON.parse(koulaProducts);
  console.log(`- Nombre de produits: ${products.length}`);
  
  if (products.length > 0) {
    console.log('\n📋 DÉTAIL DES PRODUITS:');
    products.forEach((product, index) => {
      console.log(`Produit ${index + 1}:`, {
        id: product._id,
        name: product.name,
        category: product.category,
        stock: product.stock,
        price: product.price
      });
    });
  }
} else {
  console.log('- Aucun produit trouvé');
}

// Vérifier les commandes
const clientOrders = localStorage.getItem('clientOrders');
console.log('\n📦 COMMANDES:');
if (clientOrders) {
  const orders = JSON.parse(clientOrders);
  console.log(`- Nombre de commandes: ${orders.length}`);
  
  if (orders.length > 0) {
    console.log('\n📋 DÉTAIL DES COMMANDES:');
    orders.forEach((order, index) => {
      console.log(`Commande ${index + 1}:`, {
        id: order.id || order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        status: order.status,
        date: order.createdAt || order.date
      });
    });
  }
} else {
  console.log('- Aucune commande trouvée');
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
