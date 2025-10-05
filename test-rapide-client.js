// Script de test simple pour vérifier le côté client
// À exécuter dans la console du navigateur

console.log('🧪 TEST SIMPLE - CÔTÉ CLIENT');
console.log('=' .repeat(40));

// Fonction pour vérifier rapidement l'état
const testRapideClient = () => {
  console.log('\n📊 VÉRIFICATION RAPIDE:');
  
  // 1. Utilisateur connecté
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  console.log(`👤 Utilisateur connecté: ${userData ? 'Oui' : 'Non'}`);
  console.log(`🔑 Token présent: ${token ? 'Oui' : 'Non'}`);
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log(`👤 Email: ${user.email}`);
      console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error('❌ Erreur parsing user:', error);
    }
  }
  
  // 2. Commandes
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  console.log(`📦 Commandes totales: ${orders.length}`);
  
  if (orders.length > 0) {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Répartition par statut:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    // Vérifier les commandes de l'utilisateur connecté
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userOrders = orders.filter(order => 
          order.user.email === user.email || 
          order.user.id === user.id ||
          order.user._id === user.id ||
          order.user._id === user._id
        );
        console.log(`👤 Commandes de l'utilisateur: ${userOrders.length}`);
        
        if (userOrders.length > 0) {
          console.log('📋 Commandes utilisateur:');
          userOrders.forEach((order, index) => {
            console.log(`   ${index + 1}. ${order.trackingNumber} - ${order.orderStatus}`);
          });
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    }
  }
  
  // 3. Notifications client
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  console.log(`🔔 Notifications client: ${clientNotifications.length}`);
  
  const unreadNotifications = clientNotifications.filter(n => !n.read);
  console.log(`🔔 Notifications non lues: ${unreadNotifications.length}`);
  
  if (unreadNotifications.length > 0) {
    console.log('📋 Notifications non lues:');
    unreadNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}`);
    });
  }
  
  // 4. Interface
  const currentPath = window.location.pathname;
  console.log(`📍 Page actuelle: ${currentPath}`);
  
  if (currentPath.includes('/orders')) {
    console.log('📄 Page Orders détectée');
    
    // Vérifier les éléments de la page
    const orderElements = document.querySelectorAll('[class*="order"]');
    console.log(`📦 Éléments de commande: ${orderElements.length}`);
    
    const downloadButtons = document.querySelectorAll('button[class*="download"], button[class*="facture"]');
    console.log(`📄 Boutons de téléchargement: ${downloadButtons.length}`);
    
    const notificationElements = document.querySelectorAll('[class*="notification"], [class*="bell"]');
    console.log(`🔔 Éléments de notification: ${notificationElements.length}`);
  }
  
  return {
    userConnected: !!userData,
    totalOrders: orders.length,
    clientNotifications: clientNotifications.length,
    unreadNotifications: unreadNotifications.length,
    currentPath
  };
};

// Fonction pour créer une commande de test rapide
const creerCommandeTestRapide = async () => {
  console.log('\n🧪 CRÉATION D\'UNE COMMANDE DE TEST:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Récupérer l'utilisateur connecté
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.log('❌ Utilisateur non connecté - impossible de créer une commande');
      return null;
    }
    
    const user = JSON.parse(userData);
    
    const testOrder = {
      items: [
        {
          product: 'test-product-rapide',
          quantity: 1,
          price: 100000,
          name: 'Produit Test Rapide',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: user.firstName || 'Test',
        lastName: user.lastName || 'Client',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: user.phone || '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test rapide',
      subtotal: 100000,
      tax: 0,
      total: 100000
    };

    const result = await localOrdersAPI.createOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Commande créée:', result.data.order._id);
      console.log('📋 Tracking:', result.data.order.trackingNumber);
      console.log('📋 Statut:', result.data.order.orderStatus);
      return result.data.order._id;
    } else {
      console.error('❌ Erreur:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
};

// Fonction pour approuver rapidement une commande
const approuverCommandeRapide = async (orderId) => {
  console.log('\n🔔 APPROBATION RAPIDE:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const result = await localOrdersAPI.approveOrder(orderId, 'Test rapide');
    
    if (result.success) {
      console.log('✅ Commande approuvée:', orderId);
      console.log('📋 Nouveau statut:', result.data.order.orderStatus);
      
      // Attendre un peu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } else {
      console.error('❌ Erreur:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier après approbation
const verifierApresApprobation = () => {
  console.log('\n🔍 VÉRIFICATION APRÈS APPROBATION:');
  
  // Vérifier les commandes
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  const approvedOrders = orders.filter(order => order.orderStatus === 'approved');
  console.log(`📦 Commandes approuvées: ${approvedOrders.length}`);
  
  // Vérifier les notifications
  const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  const unreadNotifications = clientNotifications.filter(n => !n.read);
  console.log(`🔔 Notifications non lues: ${unreadNotifications.length}`);
  
  if (approvedOrders.length > 0) {
    console.log('✅ Commandes approuvées trouvées!');
    approvedOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.trackingNumber} - ${order.orderStatus}`);
    });
  }
  
  if (unreadNotifications.length > 0) {
    console.log('✅ Notifications trouvées!');
    unreadNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}`);
    });
  }
  
  return {
    approvedOrders: approvedOrders.length,
    unreadNotifications: unreadNotifications.length
  };
};

// Fonction principale de test rapide
const testRapideComplet = async () => {
  console.log('🚀 DÉMARRAGE DU TEST RAPIDE...');
  
  // 1. Vérification initiale
  const etatInitial = testRapideClient();
  
  // 2. Créer une commande de test si nécessaire
  if (etatInitial.totalOrders === 0) {
    const orderId = await creerCommandeTestRapide();
    
    if (orderId) {
      // 3. Approuver la commande
      await approuverCommandeRapide(orderId);
      
      // 4. Vérifier après approbation
      const etatFinal = verifierApresApprobation();
      
      // 5. Résumé
      console.log('\n' + '='.repeat(50));
      console.log('📋 RÉSUMÉ DU TEST RAPIDE');
      console.log('='.repeat(50));
      
      console.log('🔍 Résultats:');
      console.log(`- Utilisateur connecté: ${etatInitial.userConnected ? '✅' : '❌'}`);
      console.log(`- Commandes totales: ${etatInitial.totalOrders} → ${JSON.parse(localStorage.getItem('clientOrders') || '[]').length}`);
      console.log(`- Notifications: ${etatInitial.clientNotifications} → ${etatFinal.unreadNotifications}`);
      console.log(`- Commandes approuvées: ${etatFinal.approvedOrders}`);
      
      if (etatFinal.approvedOrders > 0 && etatFinal.unreadNotifications > 0) {
        console.log('\n🎉 SUCCÈS: Le système fonctionne!');
        console.log('💡 Vous pouvez maintenant:');
        console.log('   1. Aller sur "Mes Commandes" pour voir les commandes approuvées');
        console.log('   2. Cliquer sur la cloche pour voir les notifications');
        console.log('   3. Télécharger les factures des commandes approuvées');
      } else {
        console.log('\n❌ PROBLÈME: Le système ne fonctionne pas correctement');
      }
    }
  } else {
    console.log('\n✅ Des commandes existent déjà');
    console.log('💡 Allez sur "Mes Commandes" pour les voir');
  }
};

// Exporter les fonctions
window.testRapideClient = testRapideClient;
window.creerCommandeTestRapide = creerCommandeTestRapide;
window.approuverCommandeRapide = approuverCommandeRapide;
window.verifierApresApprobation = verifierApresApprobation;
window.testRapideComplet = testRapideComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- testRapideClient() : Test rapide de l\'état');
console.log('- creerCommandeTestRapide() : Créer une commande de test');
console.log('- approuverCommandeRapide(orderId) : Approuver une commande');
console.log('- verifierApresApprobation() : Vérifier après approbation');
console.log('- testRapideComplet() : Test rapide complet');

// Exécuter automatiquement
testRapideComplet();
