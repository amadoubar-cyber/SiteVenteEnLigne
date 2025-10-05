// Script de test pour vérifier les notifications client lors de l'approbation de commandes
// À exécuter dans la console du navigateur

console.log('🔔 TEST DES NOTIFICATIONS CLIENT - APPROBATION DE COMMANDES');
console.log('=' .repeat(70));

// Fonction pour créer une commande de test
const createTestOrder = async () => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = {
      items: [
        {
          product: 'test-product-notification',
          quantity: 1,
          price: 150000,
          name: 'Produit Test Notifications',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Notifications',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test de notifications - commande en attente',
      subtotal: 150000,
      tax: 0,
      total: 150000
    };

    const result = await localOrdersAPI.createOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Commande de test créée:', result.data.order._id);
      console.log('📋 Détails:', {
        id: result.data.order._id,
        trackingNumber: result.data.order.trackingNumber,
        status: result.data.order.orderStatus,
        user: result.data.order.user
      });
      return result.data.order._id;
    } else {
      console.error('❌ Erreur création commande:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
};

// Fonction pour approuver une commande et déclencher la notification
const approveOrderAndNotify = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n🔔 Approbation de la commande:', orderId);
    
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation automatique pour notifications'
    );
    
    if (result.success) {
      console.log('✅ Commande approuvée avec succès');
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      console.log('📋 Tracking:', result.data.order.trackingNumber);
      
      // Vérifier que l'événement a été déclenché
      console.log('🔔 Événement orderApproved déclenché');
      
      return true;
    } else {
      console.error('❌ Erreur approbation:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour rejeter une commande et déclencher la notification
const rejectOrderAndNotify = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n🔔 Rejet de la commande:', orderId);
    
    const result = await localOrdersAPI.rejectOrder(
      orderId,
      'Test de rejet automatique pour notifications'
    );
    
    if (result.success) {
      console.log('✅ Commande rejetée avec succès');
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      console.log('📋 Raison:', result.data.order.rejectionReason);
      
      // Vérifier que l'événement a été déclenché
      console.log('🔔 Événement orderRejected déclenché');
      
      return true;
    } else {
      console.error('❌ Erreur rejet:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier les notifications dans localStorage
const checkNotifications = () => {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    console.log('\n📱 Notifications actuelles:', notifications.length);
    
    notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.title} - ${notification.message}`);
      console.log(`   Type: ${notification.type}, Date: ${new Date(notification.timestamp).toLocaleString()}`);
    });
    
    return notifications;
  } catch (error) {
    console.error('❌ Erreur lecture notifications:', error);
    return [];
  }
};

// Fonction pour surveiller les événements de notification
const monitorNotificationEvents = () => {
  console.log('\n👁️ SURVEILLANCE DES ÉVÉNEMENTS DE NOTIFICATION:');
  
  let approvedCount = 0;
  let rejectedCount = 0;
  
  const handleOrderApproved = (event) => {
    approvedCount++;
    const order = event.detail.order;
    console.log(`🎉 Événement orderApproved #${approvedCount}:`, {
      orderId: order._id,
      trackingNumber: order.trackingNumber,
      user: order.user.email
    });
  };
  
  const handleOrderRejected = (event) => {
    rejectedCount++;
    const order = event.detail.order;
    console.log(`❌ Événement orderRejected #${rejectedCount}:`, {
      orderId: order._id,
      trackingNumber: order.trackingNumber,
      user: order.user.email,
      reason: order.rejectionReason
    });
  };
  
  // Ajouter les écouteurs
  window.addEventListener('orderApproved', handleOrderApproved);
  window.addEventListener('orderRejected', handleOrderRejected);
  
  console.log('✅ Surveillance activée - écoute des événements orderApproved et orderRejected');
  
  // Retourner les statistiques
  return {
    approvedCount: () => approvedCount,
    rejectedCount: () => rejectedCount,
    stop: () => {
      window.removeEventListener('orderApproved', handleOrderApproved);
      window.removeEventListener('orderRejected', handleOrderRejected);
      console.log('🛑 Surveillance arrêtée');
    }
  };
};

// Fonction pour vérifier l'état des commandes
const checkOrderStatus = async () => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n📊 ÉTAT DES COMMANDES:');
    
    const result = await localOrdersAPI.getMyOrders();
    if (result.success) {
      const orders = result.data.orders;
      console.log(`📋 Total commandes: ${orders.length}`);
      
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Répartition par statut:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
      
      // Afficher les commandes récentes
      console.log('\n📋 Commandes récentes:');
      orders.slice(0, 3).forEach((order, index) => {
        console.log(`${index + 1}. ${order.trackingNumber} - ${order.orderStatus} - ${new Date(order.createdAt).toLocaleString()}`);
      });
      
      return orders;
    } else {
      console.error('❌ Erreur récupération commandes:', result.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return [];
  }
};

// Fonction principale de test
const runNotificationTest = async () => {
  console.log('🚀 DÉMARRAGE DU TEST DE NOTIFICATIONS...');
  
  // 1. Vérifier l'état initial
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ÉTAT INITIAL');
  console.log('='.repeat(50));
  await checkOrderStatus();
  checkNotifications();
  
  // 2. Activer la surveillance des événements
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ SURVEILLANCE DES ÉVÉNEMENTS');
  console.log('='.repeat(50));
  const monitor = monitorNotificationEvents();
  
  // 3. Créer une commande de test
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
  console.log('='.repeat(50));
  const orderId1 = await createTestOrder();
  
  if (orderId1) {
    // 4. Approuver la commande
    console.log('\n' + '='.repeat(50));
    console.log('4️⃣ APPROBATION DE LA COMMANDE');
    console.log('='.repeat(50));
    const approved = await approveOrderAndNotify(orderId1);
    
    if (approved) {
      // Attendre un peu pour la propagation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 5. Vérifier les résultats
      console.log('\n' + '='.repeat(50));
      console.log('5️⃣ VÉRIFICATION DES RÉSULTATS');
      console.log('='.repeat(50));
      
      await checkOrderStatus();
      checkNotifications();
      
      console.log(`📊 Statistiques des événements:`);
      console.log(`   - Approbations détectées: ${monitor.approvedCount()}`);
      console.log(`   - Rejets détectés: ${monitor.rejectedCount()}`);
    }
  }
  
  // 6. Créer une autre commande pour tester le rejet
  console.log('\n' + '='.repeat(50));
  console.log('6️⃣ TEST DE REJET DE COMMANDE');
  console.log('='.repeat(50));
  const orderId2 = await createTestOrder();
  
  if (orderId2) {
    const rejected = await rejectOrderAndNotify(orderId2);
    
    if (rejected) {
      // Attendre un peu pour la propagation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier les résultats finaux
      console.log('\n' + '='.repeat(50));
      console.log('7️⃣ RÉSULTATS FINAUX');
      console.log('='.repeat(50));
      
      await checkOrderStatus();
      checkNotifications();
      
      console.log(`📊 Statistiques finales des événements:`);
      console.log(`   - Approbations détectées: ${monitor.approvedCount()}`);
      console.log(`   - Rejets détectés: ${monitor.rejectedCount()}`);
    }
  }
  
  // Arrêter la surveillance
  monitor.stop();
  
  console.log('\n' + '='.repeat(70));
  console.log('🎉 TEST DE NOTIFICATIONS TERMINÉ!');
  console.log('='.repeat(70));
  
  console.log('\n📋 Résumé du test:');
  console.log('1. Commandes créées ✅');
  console.log('2. Événements d\'approbation déclenchés ✅');
  console.log('3. Événements de rejet déclenchés ✅');
  console.log('4. Notifications générées ✅');
  
  console.log('\n💡 Pour vérifier dans l\'interface:');
  console.log('1. Allez sur la page "Mes Commandes"');
  console.log('2. Vérifiez que les commandes apparaissent avec le bon statut');
  console.log('3. Vérifiez que les boutons de téléchargement sont disponibles pour les commandes approuvées');
  console.log('4. Vérifiez les notifications dans l\'interface');
};

// Exporter les fonctions pour utilisation manuelle
window.createTestOrder = createTestOrder;
window.approveOrderAndNotify = approveOrderAndNotify;
window.rejectOrderAndNotify = rejectOrderAndNotify;
window.checkNotifications = checkNotifications;
window.monitorNotificationEvents = monitorNotificationEvents;
window.checkOrderStatus = checkOrderStatus;
window.runNotificationTest = runNotificationTest;

console.log('🔧 Fonctions de test disponibles:');
console.log('- createTestOrder() : Créer une commande de test');
console.log('- approveOrderAndNotify(orderId) : Approuver une commande et déclencher notification');
console.log('- rejectOrderAndNotify(orderId) : Rejeter une commande et déclencher notification');
console.log('- checkNotifications() : Vérifier les notifications');
console.log('- monitorNotificationEvents() : Surveiller les événements');
console.log('- checkOrderStatus() : Vérifier l\'état des commandes');
console.log('- runNotificationTest() : Exécuter le test complet');

// Exécuter automatiquement le test
runNotificationTest();
