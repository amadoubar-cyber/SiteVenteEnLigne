// Script de diagnostic immédiat pour le problème de notifications et commandes
// À exécuter dans la console du navigateur

console.log('🔍 DIAGNOSTIC IMMÉDIAT - NOTIFICATIONS ET COMMANDES');
console.log('=' .repeat(60));

// Fonction pour vérifier l'état actuel immédiatement
const diagnosticImmediat = () => {
  console.log('\n📊 ÉTAT ACTUEL IMMÉDIAT:');
  
  // 1. Vérifier les commandes
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  console.log(`📦 Commandes dans localStorage: ${orders.length}`);
  
  if (orders.length > 0) {
    console.log('📋 Détails des commandes:');
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. ID: ${order._id}`);
      console.log(`      Tracking: ${order.trackingNumber}`);
      console.log(`      Statut: ${order.orderStatus}`);
      console.log(`      Utilisateur: ${order.user?.email || 'N/A'}`);
      console.log(`      Date: ${new Date(order.createdAt).toLocaleString()}`);
      console.log('      ---');
    });
  } else {
    console.log('❌ AUCUNE COMMANDE TROUVÉE dans localStorage');
  }
  
  // 2. Vérifier les notifications client
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  console.log(`🔔 Notifications client: ${clientNotifications.length}`);
  
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
  
  // 3. Vérifier les notifications admin
  const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
  console.log(`🔔 Notifications admin: ${adminNotifications.length}`);
  
  // 4. Vérifier l'utilisateur connecté
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  console.log(`👤 Token présent: ${token ? 'Oui' : 'Non'}`);
  console.log(`👤 Données utilisateur: ${userData ? 'Oui' : 'Non'}`);
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log(`👤 Utilisateur: ${user.email} (${user.firstName} ${user.lastName})`);
    } catch (error) {
      console.error('❌ Erreur parsing user data:', error);
    }
  }
  
  return {
    orders,
    clientNotifications,
    adminNotifications,
    hasToken: !!token,
    hasUser: !!userData
  };
};

// Fonction pour créer une commande de test immédiate
const creerCommandeTest = async () => {
  console.log('\n🧪 CRÉATION D\'UNE COMMANDE DE TEST:');
  
  try {
    // Importer l'API
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = {
      items: [
        {
          product: 'test-product-immediate',
          quantity: 1,
          price: 100000,
          name: 'Produit Test Immédiat',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Immédiat',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test immédiat pour diagnostic',
      subtotal: 100000,
      tax: 0,
      total: 100000
    };

    console.log('📦 Création de la commande...');
    const result = await localOrdersAPI.createOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Commande créée avec succès!');
      console.log('📋 Détails:', {
        id: result.data.order._id,
        trackingNumber: result.data.order.trackingNumber,
        status: result.data.order.orderStatus,
        user: result.data.order.user
      });
      
      // Vérifier immédiatement après création
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      console.log(`📦 Commandes après création: ${orders.length}`);
      
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
const approuverEtVerifier = async (orderId) => {
  console.log('\n🔔 APPROBATION ET VÉRIFICATION DES NOTIFICATIONS:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log(`📋 Approbation de la commande: ${orderId}`);
    
    // Vérifier l'état avant
    const notificationsAvant = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    console.log(`🔔 Notifications avant: ${notificationsAvant.length}`);
    
    // Approuver la commande
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation immédiat pour diagnostic'
    );
    
    if (result.success) {
      console.log('✅ Commande approuvée avec succès!');
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      
      // Attendre un peu pour la propagation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vérifier l'état après
      const notificationsApres = JSON.parse(localStorage.getItem('client_notifications') || '[]');
      console.log(`🔔 Notifications après: ${notificationsApres.length}`);
      
      if (notificationsApres.length > notificationsAvant.length) {
        console.log('🎉 SUCCÈS: Notifications générées!');
        const nouvellesNotifications = notificationsApres.slice(0, notificationsApres.length - notificationsAvant.length);
        nouvellesNotifications.forEach((notification, index) => {
          console.log(`   ${index + 1}. ${notification.title}`);
          console.log(`      ${notification.message}`);
        });
      } else {
        console.error('❌ ÉCHEC: Aucune nouvelle notification générée!');
      }
      
      // Vérifier les commandes
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const commande = orders.find(o => o._id === orderId);
      if (commande) {
        console.log('📋 Statut de la commande:', commande.orderStatus);
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

// Fonction pour vérifier la navigation
const verifierNavigation = () => {
  console.log('\n🧭 VÉRIFICATION DE LA NAVIGATION:');
  
  // Vérifier l'URL actuelle
  console.log(`📍 URL actuelle: ${window.location.href}`);
  console.log(`📍 Path: ${window.location.pathname}`);
  
  // Vérifier les liens de navigation
  const ordersLinks = document.querySelectorAll('a[href="/orders"], a[href="orders"]');
  console.log(`🔗 Liens "Mes Commandes" trouvés: ${ordersLinks.length}`);
  
  ordersLinks.forEach((link, index) => {
    console.log(`   ${index + 1}. ${link.textContent.trim()} - ${link.href}`);
  });
  
  // Vérifier si on peut naviguer vers /orders
  if (ordersLinks.length > 0) {
    console.log('✅ Navigation vers /orders possible');
    console.log('💡 Cliquez sur un des liens ci-dessus pour aller à "Mes Commandes"');
  } else {
    console.error('❌ AUCUN LIEN VERS /orders TROUVÉ!');
  }
  
  return {
    currentUrl: window.location.href,
    currentPath: window.location.pathname,
    ordersLinksCount: ordersLinks.length
  };
};

// Fonction pour vérifier l'interface utilisateur
const verifierInterface = () => {
  console.log('\n🖥️ VÉRIFICATION DE L\'INTERFACE:');
  
  // Vérifier la cloche de notifications
  const notificationBells = document.querySelectorAll('[data-testid="notification-bell"], .notification-bell, button[aria-label*="notification"], svg[data-lucide="bell"]');
  console.log(`🔔 Cloches de notifications trouvées: ${notificationBells.length}`);
  
  // Vérifier les compteurs de notifications
  const notificationCounters = document.querySelectorAll('[class*="notification"], [class*="badge"], [class*="count"], .bg-red-500');
  console.log(`🔢 Compteurs de notifications: ${notificationCounters.length}`);
  
  // Vérifier les éléments de menu utilisateur
  const userMenus = document.querySelectorAll('[data-testid="user-menu"], .user-menu, [aria-label*="user"]');
  console.log(`👤 Menus utilisateur: ${userMenus.length}`);
  
  return {
    notificationBells: notificationBells.length,
    notificationCounters: notificationCounters.length,
    userMenus: userMenus.length
  };
};

// Fonction principale de diagnostic
const diagnosticComplet = async () => {
  console.log('🚀 DÉMARRAGE DU DIAGNOSTIC COMPLET...');
  
  // 1. Diagnostic immédiat
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ DIAGNOSTIC IMMÉDIAT');
  console.log('='.repeat(50));
  const etatActuel = diagnosticImmediat();
  
  // 2. Vérifier la navigation
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION DE LA NAVIGATION');
  console.log('='.repeat(50));
  const navState = verifierNavigation();
  
  // 3. Vérifier l'interface
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ VÉRIFICATION DE L\'INTERFACE');
  console.log('='.repeat(50));
  const uiState = verifierInterface();
  
  // 4. Créer une commande de test si nécessaire
  if (etatActuel.orders.length === 0) {
    console.log('\n' + '='.repeat(50));
    console.log('4️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
    console.log('='.repeat(50));
    const orderId = await creerCommandeTest();
    
    if (orderId) {
      // 5. Approuver et vérifier les notifications
      console.log('\n' + '='.repeat(50));
      console.log('5️⃣ APPROBATION ET VÉRIFICATION');
      console.log('='.repeat(50));
      await approuverEtVerifier(orderId);
    }
  }
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Commandes trouvées: ${etatActuel.orders.length}`);
  console.log(`- Notifications client: ${etatActuel.clientNotifications.length}`);
  console.log(`- Liens navigation: ${navState.ordersLinksCount}`);
  console.log(`- Cloches notifications: ${uiState.notificationBells}`);
  console.log(`- Utilisateur connecté: ${etatActuel.hasUser ? 'Oui' : 'Non'}`);
  
  if (etatActuel.orders.length === 0) {
    console.log('\n❌ PROBLÈME: Aucune commande trouvée!');
    console.log('💡 Solution: Créez une commande via le panier');
  } else if (etatActuel.clientNotifications.length === 0) {
    console.log('\n❌ PROBLÈME: Aucune notification client!');
    console.log('💡 Solution: Approuvez une commande en tant qu\'admin');
  } else if (navState.ordersLinksCount === 0) {
    console.log('\n❌ PROBLÈME: Lien "Mes Commandes" non trouvé!');
    console.log('💡 Solution: Vérifiez le menu utilisateur');
  } else {
    console.log('\n✅ SYSTÈME FONCTIONNEL!');
  }
  
  console.log('\n💡 Instructions pour tester manuellement:');
  console.log('1. Créez une commande via le panier');
  console.log('2. Connectez-vous en tant qu\'admin et approuvez la commande');
  console.log('3. Revenez en tant que client et vérifiez les notifications');
  console.log('4. Cliquez sur "Mes Commandes" dans le menu utilisateur');
};

// Exporter les fonctions
window.diagnosticImmediat = diagnosticImmediat;
window.creerCommandeTest = creerCommandeTest;
window.approuverEtVerifier = approuverEtVerifier;
window.verifierNavigation = verifierNavigation;
window.verifierInterface = verifierInterface;
window.diagnosticComplet = diagnosticComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- diagnosticImmediat() : Diagnostic immédiat');
console.log('- creerCommandeTest() : Créer une commande de test');
console.log('- approuverEtVerifier(orderId) : Approuver et vérifier');
console.log('- verifierNavigation() : Vérifier la navigation');
console.log('- verifierInterface() : Vérifier l\'interface');
console.log('- diagnosticComplet() : Diagnostic complet');

// Exécuter automatiquement
diagnosticComplet();
