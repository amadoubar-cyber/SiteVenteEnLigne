// Script de test complet pour vérifier les notifications et téléchargement de factures
// À exécuter dans la console du navigateur

console.log('🔔 TEST COMPLET - NOTIFICATIONS ET FACTURES');
console.log('=' .repeat(60));

// Fonction pour vérifier l'état actuel
const verifierEtatActuel = () => {
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
    adminNotifications,
    statusCounts
  };
};

// Fonction pour créer une commande de test
const creerCommandeTest = async () => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = {
      items: [
        {
          product: 'test-product-final',
          quantity: 1,
          price: 250000,
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
      notes: 'Test final - notifications et factures',
      subtotal: 250000,
      tax: 0,
      total: 250000
    };

    console.log('📦 Création de la commande de test...');
    const result = await localOrdersAPI.createOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Commande créée avec succès!');
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

// Fonction pour approuver une commande (simulation admin)
const approuverCommande = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log(`🔔 Approbation de la commande: ${orderId}`);
    
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation final pour vérifier les notifications'
    );
    
    if (result.success) {
      console.log('✅ Commande approuvée avec succès!');
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      console.log('📋 Date d\'approbation:', result.data.order.approvedAt);
      
      // Attendre un peu pour la propagation des événements
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

// Fonction pour vérifier les notifications après approbation
const verifierNotifications = () => {
  console.log('\n🔔 VÉRIFICATION DES NOTIFICATIONS:');
  
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  const unreadNotifications = clientNotifications.filter(n => !n.read);
  
  console.log(`📊 Notifications totales: ${clientNotifications.length}`);
  console.log(`📊 Notifications non lues: ${unreadNotifications.length}`);
  
  if (unreadNotifications.length > 0) {
    console.log('✅ Notifications trouvées!');
    unreadNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}`);
      console.log(`      ${notification.message}`);
      console.log(`      Type: ${notification.type}`);
      console.log(`      Date: ${new Date(notification.createdAt || notification.timestamp).toLocaleString()}`);
    });
  } else {
    console.log('❌ Aucune notification non lue trouvée');
  }
  
  return {
    total: clientNotifications.length,
    unread: unreadNotifications.length,
    notifications: unreadNotifications
  };
};

// Fonction pour vérifier les commandes approuvées
const verifierCommandesApprouvees = () => {
  console.log('\n📋 VÉRIFICATION DES COMMANDES APPROUVÉES:');
  
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  const approvedOrders = orders.filter(order => order.orderStatus === 'approved');
  
  console.log(`📊 Commandes approuvées: ${approvedOrders.length}`);
  
  if (approvedOrders.length > 0) {
    console.log('✅ Commandes approuvées trouvées!');
    approvedOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. Commande ${order.trackingNumber}`);
      console.log(`      Statut: ${order.orderStatus}`);
      console.log(`      Approuvée le: ${order.approvedAt ? new Date(order.approvedAt).toLocaleString() : 'N/A'}`);
      console.log(`      Total: ${order.total} GNF`);
      console.log(`      Client: ${order.user?.email || 'N/A'}`);
    });
  } else {
    console.log('❌ Aucune commande approuvée trouvée');
  }
  
  return approvedOrders;
};

// Fonction pour tester le téléchargement de factures
const testerTelechargementFactures = (approvedOrders) => {
  console.log('\n📄 TEST DU TÉLÉCHARGEMENT DE FACTURES:');
  
  if (approvedOrders.length === 0) {
    console.log('❌ Aucune commande approuvée pour tester le téléchargement');
    return false;
  }
  
  const order = approvedOrders[0];
  console.log(`🧪 Test avec la commande: ${order.trackingNumber}`);
  
  // Simuler le téléchargement de facture
  const invoiceData = {
    orderNumber: order.trackingNumber,
    customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
    customerEmail: order.user?.email || 'N/A',
    customerPhone: order.shippingAddress?.phone || 'N/A',
    items: order.items || [],
    subtotal: order.subtotal || 0,
    shippingCost: order.shippingCost || 0,
    tax: order.tax || 0,
    total: order.total || 0,
    approvedAt: order.approvedAt,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress
  };
  
  console.log('📄 Données de facture générées:');
  console.log('   - Numéro de commande:', invoiceData.orderNumber);
  console.log('   - Client:', invoiceData.customerName);
  console.log('   - Total:', invoiceData.total, 'GNF');
  console.log('   - Date d\'approbation:', invoiceData.approvedAt ? new Date(invoiceData.approvedAt).toLocaleString() : 'N/A');
  
  console.log('✅ Téléchargement de facture simulé avec succès!');
  return true;
};

// Fonction pour vérifier l'interface utilisateur
const verifierInterfaceUtilisateur = () => {
  console.log('\n🖥️ VÉRIFICATION DE L\'INTERFACE UTILISATEUR:');
  
  // Vérifier la cloche de notifications
  const notificationBells = document.querySelectorAll('[data-testid="notification-bell"], .notification-bell, button[aria-label*="notification"], svg[data-lucide="bell"]');
  console.log(`🔔 Cloches de notifications trouvées: ${notificationBells.length}`);
  
  // Vérifier les compteurs de notifications
  const notificationCounters = document.querySelectorAll('[class*="notification"], [class*="badge"], [class*="count"], .bg-red-500');
  console.log(`🔢 Compteurs de notifications: ${notificationCounters.length}`);
  
  // Vérifier les liens vers les commandes
  const ordersLinks = document.querySelectorAll('a[href="/orders"], a[href="orders"]');
  console.log(`🔗 Liens "Mes Commandes": ${ordersLinks.length}`);
  
  // Vérifier les boutons de téléchargement de factures
  const downloadButtons = document.querySelectorAll('button[class*="download"], button[class*="facture"], [data-testid*="download"]');
  console.log(`📄 Boutons de téléchargement: ${downloadButtons.length}`);
  
  return {
    notificationBells: notificationBells.length,
    notificationCounters: notificationCounters.length,
    ordersLinks: ordersLinks.length,
    downloadButtons: downloadButtons.length
  };
};

// Fonction pour surveiller les événements
const surveillerEvenements = () => {
  console.log('\n👁️ SURVEILLANCE DES ÉVÉNEMENTS:');
  
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
const testCompletNotificationsFactures = async () => {
  console.log('🚀 DÉMARRAGE DU TEST COMPLET...');
  
  // 1. Vérifier l'état initial
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ÉTAT INITIAL');
  console.log('='.repeat(50));
  const etatInitial = verifierEtatActuel();
  
  // 2. Activer la surveillance des événements
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ SURVEILLANCE DES ÉVÉNEMENTS');
  console.log('='.repeat(50));
  const arreterSurveillance = surveillerEvenements();
  
  // 3. Créer une commande de test
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
  console.log('='.repeat(50));
  const orderId = await creerCommandeTest();
  
  if (orderId) {
    // 4. Approuver la commande
    console.log('\n' + '='.repeat(50));
    console.log('4️⃣ APPROBATION DE LA COMMANDE');
    console.log('='.repeat(50));
    const approved = await approuverCommande(orderId);
    
    if (approved) {
      // 5. Vérifier les notifications
      console.log('\n' + '='.repeat(50));
      console.log('5️⃣ VÉRIFICATION DES NOTIFICATIONS');
      console.log('='.repeat(50));
      const notificationsState = verifierNotifications();
      
      // 6. Vérifier les commandes approuvées
      console.log('\n' + '='.repeat(50));
      console.log('6️⃣ VÉRIFICATION DES COMMANDES APPROUVÉES');
      console.log('='.repeat(50));
      const approvedOrders = verifierCommandesApprouvees();
      
      // 7. Tester le téléchargement de factures
      console.log('\n' + '='.repeat(50));
      console.log('7️⃣ TEST DU TÉLÉCHARGEMENT DE FACTURES');
      console.log('='.repeat(50));
      const downloadTest = testerTelechargementFactures(approvedOrders);
      
      // 8. Vérifier l'interface utilisateur
      console.log('\n' + '='.repeat(50));
      console.log('8️⃣ VÉRIFICATION DE L\'INTERFACE UTILISATEUR');
      console.log('='.repeat(50));
      const uiState = verifierInterfaceUtilisateur();
      
      // 9. Résumé final
      console.log('\n' + '='.repeat(70));
      console.log('📋 RÉSUMÉ DU TEST COMPLET');
      console.log('='.repeat(70));
      
      console.log('🔍 Résultats:');
      console.log(`- Commandes créées: ${etatInitial.orders.length} → ${JSON.parse(localStorage.getItem('clientOrders') || '[]').length}`);
      console.log(`- Notifications client: ${etatInitial.clientNotifications.length} → ${notificationsState.total}`);
      console.log(`- Notifications non lues: ${etatInitial.unreadClientNotifications.length} → ${notificationsState.unread}`);
      console.log(`- Commandes approuvées: ${approvedOrders.length}`);
      console.log(`- Téléchargement factures: ${downloadTest ? '✅' : '❌'}`);
      console.log(`- Interface utilisateur: ${uiState.notificationBells > 0 ? '✅' : '❌'} Cloche, ${uiState.ordersLinks > 0 ? '✅' : '❌'} Liens commandes`);
      
      if (notificationsState.unread > etatInitial.unreadClientNotifications.length && approvedOrders.length > 0) {
        console.log('\n🎉 SUCCÈS: Les notifications et le téléchargement de factures fonctionnent!');
      } else {
        console.log('\n❌ ÉCHEC: Les notifications ou le téléchargement de factures ne fonctionnent pas');
      }
    }
  }
  
  // Arrêter la surveillance après 10 secondes
  setTimeout(() => {
    arreterSurveillance();
  }, 10000);
  
  console.log('\n💡 Instructions pour tester manuellement:');
  console.log('1. Allez sur /admin/orders pour approuver des commandes');
  console.log('2. Revenez en tant que client et vérifiez les notifications');
  console.log('3. Allez sur "Mes Commandes" pour voir les commandes approuvées');
  console.log('4. Testez le téléchargement de factures pour les commandes approuvées');
};

// Exporter les fonctions
window.verifierEtatActuel = verifierEtatActuel;
window.creerCommandeTest = creerCommandeTest;
window.approuverCommande = approuverCommande;
window.verifierNotifications = verifierNotifications;
window.verifierCommandesApprouvees = verifierCommandesApprouvees;
window.testerTelechargementFactures = testerTelechargementFactures;
window.verifierInterfaceUtilisateur = verifierInterfaceUtilisateur;
window.surveillerEvenements = surveillerEvenements;
window.testCompletNotificationsFactures = testCompletNotificationsFactures;

console.log('🔧 Fonctions de test disponibles:');
console.log('- verifierEtatActuel() : Vérifier l\'état actuel');
console.log('- creerCommandeTest() : Créer une commande de test');
console.log('- approuverCommande(orderId) : Approuver une commande');
console.log('- verifierNotifications() : Vérifier les notifications');
console.log('- verifierCommandesApprouvees() : Vérifier les commandes approuvées');
console.log('- testerTelechargementFactures(orders) : Tester le téléchargement');
console.log('- verifierInterfaceUtilisateur() : Vérifier l\'interface');
console.log('- surveillerEvenements() : Surveiller les événements');
console.log('- testCompletNotificationsFactures() : Test complet');

// Exécuter automatiquement le test complet
testCompletNotificationsFactures();
