// Script de diagnostic spécifique pour le côté client
// À exécuter dans la console du navigateur

console.log('🔍 DIAGNOSTIC CÔTÉ CLIENT - NOTIFICATIONS ET FACTURES');
console.log('=' .repeat(60));

// Fonction pour vérifier l'état du client
const verifierEtatClient = () => {
  console.log('\n👤 ÉTAT DU CLIENT:');
  
  // Vérifier l'utilisateur connecté
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  console.log(`🔑 Token présent: ${token ? 'Oui' : 'Non'}`);
  console.log(`👤 Données utilisateur: ${userData ? 'Oui' : 'Non'}`);
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log(`👤 Utilisateur: ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`👤 ID: ${user.id || user._id}`);
    } catch (error) {
      console.error('❌ Erreur parsing user data:', error);
    }
  }
  
  return { token: !!token, user: !!userData, userData: userData ? JSON.parse(userData) : null };
};

// Fonction pour vérifier les commandes du client
const verifierCommandesClient = () => {
  console.log('\n📦 COMMANDES DU CLIENT:');
  
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  console.log(`📦 Commandes totales: ${orders.length}`);
  
  if (orders.length === 0) {
    console.log('❌ AUCUNE COMMANDE TROUVÉE');
    return { orders: [], userOrders: [] };
  }
  
  // Vérifier l'utilisateur connecté
  const userData = localStorage.getItem('user');
  let currentUser = null;
  
  if (userData) {
    try {
      currentUser = JSON.parse(userData);
    } catch (error) {
      console.error('❌ Erreur parsing user data:', error);
    }
  }
  
  if (!currentUser) {
    console.log('❌ UTILISATEUR NON CONNECTÉ');
    return { orders, userOrders: [] };
  }
  
  // Filtrer les commandes de l'utilisateur connecté
  const userOrders = orders.filter(order => 
    order.user.email === currentUser.email || 
    order.user.id === currentUser.id ||
    order.user._id === currentUser.id ||
    order.user._id === currentUser._id
  );
  
  console.log(`👤 Commandes de l'utilisateur: ${userOrders.length}`);
  
  if (userOrders.length > 0) {
    console.log('📋 Détails des commandes utilisateur:');
    userOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ID: ${order._id}`);
      console.log(`      Tracking: ${order.trackingNumber}`);
      console.log(`      Statut: ${order.orderStatus}`);
      console.log(`      Client: ${order.user.email}`);
      console.log(`      Total: ${order.total} GNF`);
      console.log(`      Date: ${new Date(order.createdAt).toLocaleString()}`);
      console.log('      ---');
    });
  } else {
    console.log('❌ AUCUNE COMMANDE TROUVÉE POUR CET UTILISATEUR');
  }
  
  return { orders, userOrders, currentUser };
};

// Fonction pour vérifier les notifications client
const verifierNotificationsClient = () => {
  console.log('\n🔔 NOTIFICATIONS CLIENT:');
  
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  console.log(`🔔 Notifications totales: ${clientNotifications.length}`);
  
  const unreadNotifications = clientNotifications.filter(n => !n.read);
  console.log(`🔔 Notifications non lues: ${unreadNotifications.length}`);
  
  if (clientNotifications.length > 0) {
    console.log('📋 Détails des notifications:');
    clientNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}`);
      console.log(`      Message: ${notification.message}`);
      console.log(`      Type: ${notification.type}`);
      console.log(`      Lu: ${notification.read ? 'Oui' : 'Non'}`);
      console.log(`      Date: ${new Date(notification.createdAt || notification.timestamp).toLocaleString()}`);
      console.log('      ---');
    });
  } else {
    console.log('❌ AUCUNE NOTIFICATION CLIENT TROUVÉE');
  }
  
  return { total: clientNotifications.length, unread: unreadNotifications.length, notifications: clientNotifications };
};

// Fonction pour vérifier l'interface utilisateur
const verifierInterfaceClient = () => {
  console.log('\n🖥️ INTERFACE CLIENT:');
  
  // Vérifier la page actuelle
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  console.log(`📍 URL actuelle: ${currentUrl}`);
  console.log(`📍 Path: ${currentPath}`);
  
  // Vérifier les éléments de la page Orders
  if (currentPath.includes('/orders')) {
    console.log('📄 Page Orders détectée');
    
    // Vérifier les commandes affichées
    const orderElements = document.querySelectorAll('[class*="order"], [data-testid*="order"]');
    console.log(`📦 Éléments de commande trouvés: ${orderElements.length}`);
    
    // Vérifier les boutons de téléchargement
    const downloadButtons = document.querySelectorAll('button[class*="download"], button[class*="facture"], [data-testid*="download"]');
    console.log(`📄 Boutons de téléchargement: ${downloadButtons.length}`);
    
    // Vérifier les statuts des commandes
    const statusElements = document.querySelectorAll('[class*="status"], [class*="badge"]');
    console.log(`🏷️ Éléments de statut: ${statusElements.length}`);
    
    // Vérifier les notifications
    const notificationElements = document.querySelectorAll('[class*="notification"], [class*="bell"]');
    console.log(`🔔 Éléments de notification: ${notificationElements.length}`);
  }
  
  // Vérifier la cloche de notifications dans le header
  const notificationBells = document.querySelectorAll('[data-testid="notification-bell"], .notification-bell, button[aria-label*="notification"], svg[data-lucide="bell"]');
  console.log(`🔔 Cloches de notifications dans header: ${notificationBells.length}`);
  
  // Vérifier les compteurs de notifications
  const notificationCounters = document.querySelectorAll('[class*="notification"], [class*="badge"], [class*="count"], .bg-red-500');
  console.log(`🔢 Compteurs de notifications: ${notificationCounters.length}`);
  
  return {
    currentUrl,
    currentPath,
    isOrdersPage: currentPath.includes('/orders'),
    notificationBells: notificationBells.length,
    notificationCounters: notificationCounters.length
  };
};

// Fonction pour créer une commande de test pour le client actuel
const creerCommandeTestClient = async () => {
  console.log('\n🧪 CRÉATION D\'UNE COMMANDE DE TEST POUR LE CLIENT:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Récupérer les données de l'utilisateur connecté
    const userData = localStorage.getItem('user');
    let currentUser = null;
    
    if (userData) {
      try {
        currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('❌ Erreur parsing user data:', error);
      }
    }
    
    if (!currentUser) {
      console.log('❌ UTILISATEUR NON CONNECTÉ - Impossible de créer une commande de test');
      return null;
    }
    
    const testOrder = {
      items: [
        {
          product: 'test-product-client',
          quantity: 1,
          price: 150000,
          name: 'Produit Test Client',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: currentUser.firstName || 'Test',
        lastName: currentUser.lastName || 'Client',
        street: '123 Rue Test Client',
        city: 'Conakry',
        phone: currentUser.phone || '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test client - notifications et factures',
      subtotal: 150000,
      tax: 0,
      total: 150000
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

// Fonction pour simuler l'approbation d'une commande
const simulerApprobationCommande = async (orderId) => {
  console.log('\n🔔 SIMULATION D\'APPROBATION DE COMMANDE:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log(`📋 Approbation de la commande: ${orderId}`);
    
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation pour diagnostic client'
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

// Fonction pour vérifier les événements
const verifierEvenements = () => {
  console.log('\n👁️ VÉRIFICATION DES ÉVÉNEMENTS:');
  
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

// Fonction principale de diagnostic client
const diagnosticCompletClient = async () => {
  console.log('🚀 DÉMARRAGE DU DIAGNOSTIC CLIENT...');
  
  // 1. Vérifier l'état du client
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ÉTAT DU CLIENT');
  console.log('='.repeat(50));
  const etatClient = verifierEtatClient();
  
  // 2. Vérifier les commandes du client
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION DES COMMANDES DU CLIENT');
  console.log('='.repeat(50));
  const commandesClient = verifierCommandesClient();
  
  // 3. Vérifier les notifications client
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ VÉRIFICATION DES NOTIFICATIONS CLIENT');
  console.log('='.repeat(50));
  const notificationsClient = verifierNotificationsClient();
  
  // 4. Vérifier l'interface client
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ VÉRIFICATION DE L\'INTERFACE CLIENT');
  console.log('='.repeat(50));
  const interfaceClient = verifierInterfaceClient();
  
  // 5. Activer la surveillance des événements
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ SURVEILLANCE DES ÉVÉNEMENTS');
  console.log('='.repeat(50));
  const arreterSurveillance = verifierEvenements();
  
  // 6. Créer une commande de test si nécessaire
  if (commandesClient.userOrders.length === 0 && etatClient.user) {
    console.log('\n' + '='.repeat(50));
    console.log('6️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
    console.log('='.repeat(50));
    const orderId = await creerCommandeTestClient();
    
    if (orderId) {
      // 7. Simuler l'approbation
      console.log('\n' + '='.repeat(50));
      console.log('7️⃣ SIMULATION D\'APPROBATION');
      console.log('='.repeat(50));
      await simulerApprobationCommande(orderId);
    }
  }
  
  // 8. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC CLIENT');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Utilisateur connecté: ${etatClient.user ? '✅' : '❌'}`);
  console.log(`- Commandes totales: ${commandesClient.orders.length}`);
  console.log(`- Commandes utilisateur: ${commandesClient.userOrders.length}`);
  console.log(`- Notifications totales: ${notificationsClient.total}`);
  console.log(`- Notifications non lues: ${notificationsClient.unread}`);
  console.log(`- Page actuelle: ${interfaceClient.currentPath}`);
  console.log(`- Cloches notifications: ${interfaceClient.notificationBells}`);
  
  if (commandesClient.userOrders.length === 0) {
    console.log('\n❌ PROBLÈME: Aucune commande trouvée pour cet utilisateur!');
    console.log('💡 Solution: Créez une commande via le panier');
  } else if (notificationsClient.unread === 0) {
    console.log('\n❌ PROBLÈME: Aucune notification non lue!');
    console.log('💡 Solution: Approuvez une commande en tant qu\'admin');
  } else if (interfaceClient.notificationBells === 0) {
    console.log('\n❌ PROBLÈME: Cloche de notifications non trouvée!');
    console.log('💡 Solution: Vérifiez le header de la page');
  } else {
    console.log('\n✅ SYSTÈME CLIENT FONCTIONNEL!');
  }
  
  // Arrêter la surveillance après 10 secondes
  setTimeout(() => {
    arreterSurveillance();
  }, 10000);
  
  console.log('\n💡 Instructions pour tester manuellement:');
  console.log('1. Créez une commande via le panier');
  console.log('2. Connectez-vous en tant qu\'admin et approuvez la commande');
  console.log('3. Revenez en tant que client et vérifiez les notifications');
  console.log('4. Allez sur "Mes Commandes" pour voir les commandes approuvées');
};

// Exporter les fonctions
window.verifierEtatClient = verifierEtatClient;
window.verifierCommandesClient = verifierCommandesClient;
window.verifierNotificationsClient = verifierNotificationsClient;
window.verifierInterfaceClient = verifierInterfaceClient;
window.creerCommandeTestClient = creerCommandeTestClient;
window.simulerApprobationCommande = simulerApprobationCommande;
window.verifierEvenements = verifierEvenements;
window.diagnosticCompletClient = diagnosticCompletClient;

console.log('🔧 Fonctions de test disponibles:');
console.log('- verifierEtatClient() : Vérifier l\'état du client');
console.log('- verifierCommandesClient() : Vérifier les commandes du client');
console.log('- verifierNotificationsClient() : Vérifier les notifications client');
console.log('- verifierInterfaceClient() : Vérifier l\'interface client');
console.log('- creerCommandeTestClient() : Créer une commande de test');
console.log('- simulerApprobationCommande(orderId) : Simuler l\'approbation');
console.log('- verifierEvenements() : Vérifier les événements');
console.log('- diagnosticCompletClient() : Diagnostic complet client');

// Exécuter automatiquement le diagnostic
diagnosticCompletClient();
