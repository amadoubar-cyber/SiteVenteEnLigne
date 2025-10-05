// Script de test complet pour vérifier les notifications client et l'espace commandes
// À exécuter dans la console du navigateur

console.log('🔔 TEST COMPLET - NOTIFICATIONS CLIENT ET ESPACE COMMANDES');
console.log('=' .repeat(70));

// Fonction pour vérifier l'état actuel
const checkCurrentState = () => {
  console.log('\n📊 ÉTAT ACTUEL DU SYSTÈME:');
  
  // Vérifier les commandes
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  console.log(`📦 Commandes totales: ${orders.length}`);
  
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 Répartition par statut:');
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });
  
  // Vérifier les notifications client
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  console.log(`🔔 Notifications client: ${clientNotifications.length}`);
  
  const unreadClientNotifications = clientNotifications.filter(n => !n.read);
  console.log(`🔔 Notifications non lues: ${unreadClientNotifications.length}`);
  
  // Vérifier les notifications admin
  const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
  console.log(`🔔 Notifications admin: ${adminNotifications.length}`);
  
  return {
    orders,
    clientNotifications,
    unreadClientNotifications,
    adminNotifications
  };
};

// Fonction pour créer une commande de test
const createTestOrder = async () => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = {
      items: [
        {
          product: 'test-product-final',
          quantity: 1,
          price: 200000,
          name: 'Produit Test Final',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Final',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test final - notifications et commandes',
      subtotal: 200000,
      tax: 0,
      total: 200000
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

// Fonction pour approuver une commande et vérifier les notifications
const approveOrderAndCheckNotifications = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n🔔 Approbation de la commande:', orderId);
    
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation final pour vérifier les notifications'
    );
    
    if (result.success) {
      console.log('✅ Commande approuvée avec succès');
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      
      // Attendre un peu pour la propagation des événements
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier les notifications après approbation
      const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
      const unreadNotifications = clientNotifications.filter(n => !n.read);
      
      console.log('🔔 Notifications après approbation:');
      console.log(`   Total: ${clientNotifications.length}`);
      console.log(`   Non lues: ${unreadNotifications.length}`);
      
      if (unreadNotifications.length > 0) {
        console.log('✅ Notifications générées avec succès!');
        unreadNotifications.forEach((notification, index) => {
          console.log(`   ${index + 1}. ${notification.title} - ${notification.message}`);
        });
      } else {
        console.error('❌ Aucune notification générée!');
      }
      
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

// Fonction pour vérifier l'interface utilisateur
const checkUIElements = () => {
  console.log('\n🖥️ VÉRIFICATION DE L\'INTERFACE UTILISATEUR:');
  
  // Vérifier si le lien "Mes Commandes" existe
  const ordersLink = document.querySelector('a[href="/orders"]');
  if (ordersLink) {
    console.log('✅ Lien "Mes Commandes" trouvé dans la navigation');
  } else {
    console.error('❌ Lien "Mes Commandes" non trouvé');
  }
  
  // Vérifier la cloche de notifications
  const notificationBell = document.querySelector('[data-testid="notification-bell"], .notification-bell, button[aria-label*="notification"]');
  if (notificationBell) {
    console.log('✅ Cloche de notifications trouvée');
  } else {
    console.log('⚠️ Cloche de notifications non trouvée (peut être normale)');
  }
  
  // Vérifier les compteurs de notifications
  const notificationCounters = document.querySelectorAll('[class*="notification"], [class*="badge"], [class*="count"]');
  console.log(`🔔 Éléments de compteur trouvés: ${notificationCounters.length}`);
  
  return {
    ordersLink: !!ordersLink,
    notificationBell: !!notificationBell,
    counters: notificationCounters.length
  };
};

// Fonction pour tester la navigation
const testNavigation = () => {
  console.log('\n🧭 TEST DE NAVIGATION:');
  
  // Vérifier les routes disponibles
  const currentPath = window.location.pathname;
  console.log(`📍 Page actuelle: ${currentPath}`);
  
  // Vérifier si on peut naviguer vers /orders
  const ordersLink = document.querySelector('a[href="/orders"]');
  if (ordersLink) {
    console.log('✅ Navigation vers /orders possible');
    
    // Simuler un clic (optionnel)
    console.log('💡 Pour tester: cliquez sur le lien "Mes Commandes" dans le menu utilisateur');
  } else {
    console.error('❌ Impossible de naviguer vers /orders - lien non trouvé');
  }
  
  return {
    currentPath,
    canNavigateToOrders: !!ordersLink
  };
};

// Fonction pour surveiller les événements en temps réel
const monitorEvents = () => {
  console.log('\n👁️ SURVEILLANCE DES ÉVÉNEMENTS EN TEMPS RÉEL:');
  
  let eventCount = 0;
  
  const eventTypes = ['orderApproved', 'orderRejected', 'newOrderCreated'];
  
  eventTypes.forEach(eventType => {
    const handler = (event) => {
      eventCount++;
      console.log(`🔔 Événement ${eventType} #${eventCount}:`, event.detail);
    };
    
    window.addEventListener(eventType, handler);
    console.log(`✅ Écoute activée pour: ${eventType}`);
  });
  
  console.log('👁️ Surveillance active - tous les événements seront loggés');
  
  return () => {
    eventTypes.forEach(eventType => {
      window.removeEventListener(eventType, handler);
    });
    console.log('🛑 Surveillance arrêtée');
  };
};

// Fonction principale de test
const runCompleteTest = async () => {
  console.log('🚀 DÉMARRAGE DU TEST COMPLET...');
  
  // 1. Vérifier l'état initial
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ÉTAT INITIAL');
  console.log('='.repeat(50));
  const initialState = checkCurrentState();
  
  // 2. Vérifier l'interface utilisateur
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION DE L\'INTERFACE UTILISATEUR');
  console.log('='.repeat(50));
  const uiState = checkUIElements();
  
  // 3. Vérifier la navigation
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ VÉRIFICATION DE LA NAVIGATION');
  console.log('='.repeat(50));
  const navState = testNavigation();
  
  // 4. Activer la surveillance des événements
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ SURVEILLANCE DES ÉVÉNEMENTS');
  console.log('='.repeat(50));
  const stopMonitoring = monitorEvents();
  
  // 5. Créer une commande de test
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
  console.log('='.repeat(50));
  const orderId = await createTestOrder();
  
  if (orderId) {
    // 6. Approuver la commande et vérifier les notifications
    console.log('\n' + '='.repeat(50));
    console.log('6️⃣ APPROBATION ET VÉRIFICATION DES NOTIFICATIONS');
    console.log('='.repeat(50));
    const approved = await approveOrderAndCheckNotifications(orderId);
    
    if (approved) {
      // 7. Vérification finale
      console.log('\n' + '='.repeat(50));
      console.log('7️⃣ VÉRIFICATION FINALE');
      console.log('='.repeat(50));
      const finalState = checkCurrentState();
      
      // 8. Résumé
      console.log('\n' + '='.repeat(70));
      console.log('📋 RÉSUMÉ DU TEST COMPLET');
      console.log('='.repeat(70));
      
      console.log('✅ Résultats:');
      console.log(`- Commandes créées: ${initialState.orders.length} → ${finalState.orders.length}`);
      console.log(`- Notifications client: ${initialState.clientNotifications.length} → ${finalState.clientNotifications.length}`);
      console.log(`- Notifications non lues: ${initialState.unreadClientNotifications.length} → ${finalState.unreadClientNotifications.length}`);
      console.log(`- Interface utilisateur: ${uiState.ordersLink ? '✅' : '❌'} Lien commandes, ${uiState.notificationBell ? '✅' : '⚠️'} Cloche notifications`);
      console.log(`- Navigation: ${navState.canNavigateToOrders ? '✅' : '❌'} Vers /orders`);
      
      if (finalState.unreadClientNotifications.length > initialState.unreadClientNotifications.length) {
        console.log('🎉 SUCCÈS: Les notifications client fonctionnent!');
      } else {
        console.error('❌ ÉCHEC: Les notifications client ne fonctionnent pas');
      }
    }
  }
  
  // Arrêter la surveillance
  setTimeout(() => {
    stopMonitoring();
  }, 10000);
  
  console.log('\n💡 Instructions pour tester manuellement:');
  console.log('1. Allez sur la page "Mes Commandes" (/orders)');
  console.log('2. Vérifiez que vos commandes s\'affichent');
  console.log('3. Vérifiez que les notifications apparaissent dans la cloche');
  console.log('4. Testez le bouton d\'actualisation');
  console.log('5. Testez le téléchargement de factures pour les commandes approuvées');
};

// Exporter les fonctions pour utilisation manuelle
window.checkCurrentState = checkCurrentState;
window.createTestOrder = createTestOrder;
window.approveOrderAndCheckNotifications = approveOrderAndCheckNotifications;
window.checkUIElements = checkUIElements;
window.testNavigation = testNavigation;
window.monitorEvents = monitorEvents;
window.runCompleteTest = runCompleteTest;

console.log('🔧 Fonctions de test disponibles:');
console.log('- checkCurrentState() : Vérifier l\'état actuel');
console.log('- createTestOrder() : Créer une commande de test');
console.log('- approveOrderAndCheckNotifications(orderId) : Approuver et vérifier notifications');
console.log('- checkUIElements() : Vérifier l\'interface utilisateur');
console.log('- testNavigation() : Tester la navigation');
console.log('- monitorEvents() : Surveiller les événements');
console.log('- runCompleteTest() : Exécuter le test complet');

// Exécuter automatiquement le test complet
runCompleteTest();
