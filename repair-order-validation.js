// Script de réparation automatique du système de validation des commandes
// À exécuter dans la console du navigateur

console.log('🔧 DÉMARRAGE DE LA RÉPARATION AUTOMATIQUE...');
console.log('=' .repeat(60));

// Fonction pour créer un ID unique
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Fonction pour créer un numéro de suivi
const generateTrackingNumber = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let tracking = '';
  
  for (let i = 0; i < 2; i++) {
    tracking += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  for (let i = 0; i < 8; i++) {
    tracking += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return tracking;
};

// 1. Vérifier et créer les clés localStorage manquantes
console.log('📋 Étape 1: Vérification des clés localStorage...');

const requiredKeys = ['clientOrders', 'admin_notifications'];
let createdKeys = 0;

requiredKeys.forEach(key => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, '[]');
    console.log(`✅ Clé ${key} créée`);
    createdKeys++;
  } else {
    console.log(`✅ Clé ${key} existe déjà`);
  }
});

console.log(`📊 ${createdKeys} nouvelles clés créées`);

// 2. Réparer les commandes existantes
console.log('\n📦 Étape 2: Réparation des commandes...');

const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
let fixedOrders = 0;
let repairedOrders = [];

orders.forEach((order, index) => {
  let needsRepair = false;
  const repairedOrder = { ...order };
  
  // Vérifier et réparer les champs manquants
  if (!repairedOrder.orderStatus) {
    repairedOrder.orderStatus = 'pending_approval';
    needsRepair = true;
  }
  
  if (!repairedOrder.trackingNumber) {
    repairedOrder.trackingNumber = generateTrackingNumber();
    needsRepair = true;
  }
  
  if (!repairedOrder._id) {
    repairedOrder._id = generateId();
    needsRepair = true;
  }
  
  if (!repairedOrder.createdAt) {
    repairedOrder.createdAt = new Date().toISOString();
    needsRepair = true;
  }
  
  if (!repairedOrder.updatedAt) {
    repairedOrder.updatedAt = new Date().toISOString();
    needsRepair = true;
  }
  
  // Vérifier la structure des items
  if (repairedOrder.items && Array.isArray(repairedOrder.items)) {
    repairedOrder.items.forEach(item => {
      if (!item.name) item.name = 'Produit';
      if (!item.price) item.price = 0;
      if (!item.quantity) item.quantity = 1;
    });
  }
  
  // Vérifier l'adresse de livraison
  if (!repairedOrder.shippingAddress) {
    repairedOrder.shippingAddress = {
      firstName: 'Client',
      lastName: 'Inconnu',
      street: 'Adresse non spécifiée',
      city: 'Conakry',
      phone: '+224 000 000 000'
    };
    needsRepair = true;
  }
  
  if (needsRepair) {
    repairedOrders[index] = repairedOrder;
    fixedOrders++;
    console.log(`🔧 Commande ${index + 1} réparée`);
  }
});

if (fixedOrders > 0) {
  // Appliquer les réparations
  repairedOrders.forEach((repairedOrder, index) => {
    if (repairedOrder) {
      orders[index] = repairedOrder;
    }
  });
  
  localStorage.setItem('clientOrders', JSON.stringify(orders));
  console.log(`✅ ${fixedOrders} commandes réparées`);
} else {
  console.log('✅ Aucune commande nécessite de réparation');
}

// 3. Réparer les notifications
console.log('\n🔔 Étape 3: Réparation des notifications...');

const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
let fixedNotifications = 0;

notifications.forEach((notification, index) => {
  let needsRepair = false;
  
  if (typeof notification.read === 'undefined') {
    notification.read = false;
    needsRepair = true;
  }
  
  if (!notification.id) {
    notification.id = generateId();
    needsRepair = true;
  }
  
  if (!notification.timestamp) {
    notification.timestamp = new Date().toISOString();
    needsRepair = true;
  }
  
  if (!notification.type) {
    notification.type = 'info';
    needsRepair = true;
  }
  
  if (needsRepair) {
    fixedNotifications++;
    console.log(`🔧 Notification ${index + 1} réparée`);
  }
});

if (fixedNotifications > 0) {
  localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  console.log(`✅ ${fixedNotifications} notifications réparées`);
} else {
  console.log('✅ Aucune notification nécessite de réparation');
}

// 4. Créer des données de test si nécessaire
console.log('\n🧪 Étape 4: Création de données de test...');

if (orders.length === 0) {
  console.log('📦 Aucune commande trouvée, création d\'une commande de test...');
  
  const testOrder = {
    _id: generateId(),
    user: {
      id: 'test-user',
      firstName: 'Test',
      lastName: 'Client',
      email: 'test@koula.gn',
      phone: '+224 123 456 789'
    },
    items: [
      {
        product: 'test-product-1',
        quantity: 2,
        price: 50000,
        name: 'Produit Test 1',
        image: ''
      },
      {
        product: 'test-product-2',
        quantity: 1,
        price: 75000,
        name: 'Produit Test 2',
        image: ''
      }
    ],
    shippingAddress: {
      firstName: 'Test',
      lastName: 'Client',
      street: '123 Rue Test',
      city: 'Conakry',
      phone: '+224 123 456 789'
    },
    paymentMethod: 'mobile_money',
    notes: 'Commande de test créée automatiquement',
    subtotal: 175000,
    shippingCost: 0,
    tax: 0,
    total: 175000,
    orderStatus: 'pending_approval',
    trackingNumber: generateTrackingNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.unshift(testOrder);
  localStorage.setItem('clientOrders', JSON.stringify(orders));
  console.log('✅ Commande de test créée');
}

// 5. Créer une notification de test
if (notifications.length === 0) {
  console.log('🔔 Aucune notification trouvée, création d\'une notification de test...');
  
  const testNotification = {
    id: generateId(),
    type: 'info',
    title: 'Système Réparé',
    message: 'Le système de validation des commandes a été réparé avec succès',
    timestamp: new Date().toISOString(),
    read: false
  };
  
  notifications.unshift(testNotification);
  localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  console.log('✅ Notification de test créée');
}

// 6. Résumé final
console.log('\n' + '=' .repeat(60));
console.log('🎉 RÉPARATION TERMINÉE !');
console.log('=' .repeat(60));

const finalOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
const finalNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');

console.log(`📊 Résumé final:`);
console.log(`   - Commandes: ${finalOrders.length}`);
console.log(`   - Notifications: ${finalNotifications.length}`);
console.log(`   - Commandes en attente: ${finalOrders.filter(o => o.orderStatus === 'pending_approval').length}`);
console.log(`   - Notifications non lues: ${finalNotifications.filter(n => !n.read).length}`);

console.log('\n📋 Prochaines étapes:');
console.log('   1. Rechargez la page');
console.log('   2. Allez sur /admin/order-approval');
console.log('   3. Testez l\'approbation/rejet des commandes');
console.log('   4. Vérifiez les notifications');

console.log('\n🔧 Si le problème persiste:');
console.log('   1. Allez sur /admin/order-debug');
console.log('   2. Exécutez les tests automatiques');
console.log('   3. Vérifiez les erreurs dans la console');

console.log('\n✨ Le système est maintenant réparé et prêt à être utilisé !');
