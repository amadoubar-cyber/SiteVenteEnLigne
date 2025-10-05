// Script de création rapide d'un espace client complet
// À exécuter dans la console du navigateur

console.log('🚀 CRÉATION RAPIDE - ESPACE CLIENT COMPLET');
console.log('=' .repeat(50));

// Fonction pour créer des commandes de test pour le client
const creerCommandesTestClient = async () => {
  console.log('\n📦 CRÉATION DE COMMANDES DE TEST POUR LE CLIENT:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Récupérer l'utilisateur connecté
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.log('❌ Utilisateur non connecté - impossible de créer des commandes');
      return [];
    }
    
    const user = JSON.parse(userData);
    
    const commandesTest = [
      {
        items: [
          {
            product: 'fer-test-1',
            quantity: 2,
            price: 300000,
            name: 'FER',
            image: 'test-image-1'
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
        notes: 'Commande de test - FER',
        subtotal: 600000,
        tax: 0,
        total: 600000
      },
      {
        items: [
          {
            product: 'ciment-test-1',
            quantity: 1,
            price: 150000,
            name: 'CIMENT',
            image: 'test-image-2'
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
        notes: 'Commande de test - CIMENT',
        subtotal: 150000,
        tax: 0,
        total: 150000
      }
    ];

    const commandesCreees = [];
    
    for (const commandeData of commandesTest) {
      console.log(`📦 Création de la commande: ${commandeData.items[0].name}...`);
      
      const result = await localOrdersAPI.createOrder(commandeData);
      
      if (result.success) {
        console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
        commandesCreees.push(result.data.order._id);
      } else {
        console.error(`❌ Erreur création commande: ${result.error}`);
      }
    }
    
    return commandesCreees;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return [];
  }
};

// Fonction pour approuver une commande rapidement
const approuverCommandeRapide = async (orderId) => {
  console.log(`\n🔔 APPROBATION RAPIDE: ${orderId}`);
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const result = await localOrdersAPI.approveOrder(orderId, 'Approbation automatique pour test client');
    
    if (result.success) {
      console.log(`✅ Commande approuvée: ${orderId}`);
      console.log(`📋 Nouveau statut: ${result.data.order.orderStatus}`);
      return true;
    } else {
      console.error(`❌ Erreur approbation: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour créer un système complet de test
const creerSystemeCompletTest = async () => {
  console.log('\n🧪 CRÉATION DU SYSTÈME COMPLET DE TEST:');
  
  try {
    // 1. Créer des commandes de test
    console.log('\n1️⃣ Création des commandes de test...');
    const commandesCreees = await creerCommandesTestClient();
    
    if (commandesCreees.length === 0) {
      console.log('❌ Aucune commande créée');
      return false;
    }
    
    console.log(`✅ ${commandesCreees.length} commandes créées`);
    
    // 2. Approuver la première commande
    console.log('\n2️⃣ Approbation de la première commande...');
    const premiereCommande = commandesCreees[0];
    const approuvee = await approuverCommandeRapide(premiereCommande);
    
    if (approuvee) {
      console.log('✅ Première commande approuvée');
    }
    
    // 3. Attendre un peu pour la propagation des événements
    console.log('\n3️⃣ Attente de la propagation des événements...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Vérifier l'état final
    console.log('\n4️⃣ Vérification de l\'état final...');
    const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    const commandesUtilisateur = orders.filter(order => 
      order.user.email === userData.email || 
      order.user.id === userData.id ||
      order.user._id === userData.id ||
      order.user._id === userData._id
    );
    
    const commandesApprouvees = commandesUtilisateur.filter(order => 
      order.orderStatus === 'approved' || order.orderStatus === 'delivered'
    );
    
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    const notificationsNonLues = notifications.filter(n => !n.read);
    
    console.log(`📦 Commandes utilisateur: ${commandesUtilisateur.length}`);
    console.log(`✅ Commandes approuvées: ${commandesApprouvees.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`🔔 Notifications non lues: ${notificationsNonLues.length}`);
    
    return {
      commandesUtilisateur: commandesUtilisateur.length,
      commandesApprouvees: commandesApprouvees.length,
      notifications: notifications.length,
      notificationsNonLues: notificationsNonLues.length
    };
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier l'accès à l'espace client
const verifierAccesEspaceClient = () => {
  console.log('\n🔍 VÉRIFICATION DE L\'ACCÈS À L\'ESPACE CLIENT:');
  
  // Vérifier l'utilisateur connecté
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
  
  // Vérifier les commandes
  const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
  console.log(`📦 Commandes totales: ${orders.length}`);
  
  // Vérifier les notifications
  const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  console.log(`🔔 Notifications: ${notifications.length}`);
  
  // Vérifier l'URL actuelle
  const currentPath = window.location.pathname;
  console.log(`📍 Page actuelle: ${currentPath}`);
  
  return {
    userConnected: !!userData,
    totalOrders: orders.length,
    totalNotifications: notifications.length,
    currentPath
  };
};

// Fonction pour créer un lien direct vers l'espace client
const creerLienDirectEspaceClient = () => {
  console.log('\n🔗 CRÉATION D\'UN LIEN DIRECT VERS L\'ESPACE CLIENT:');
  
  // Vérifier si on est sur la bonne page
  const currentPath = window.location.pathname;
  
  if (currentPath === '/orders') {
    console.log('✅ Vous êtes déjà sur la page des commandes');
    return true;
  }
  
  // Créer un bouton temporaire pour aller à l'espace client
  const button = document.createElement('button');
  button.innerHTML = '🚀 ALLER À MES COMMANDES';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: #3B82F6;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
  `;
  
  button.onclick = () => {
    window.location.href = '/orders';
  };
  
  document.body.appendChild(button);
  
  console.log('✅ Bouton "ALLER À MES COMMANDES" créé en haut à droite');
  console.log('💡 Cliquez sur le bouton bleu pour accéder à vos commandes');
  
  return true;
};

// Fonction pour simuler une notification de commande approuvée
const simulerNotificationCommandeApprouvee = () => {
  console.log('\n🔔 SIMULATION D\'UNE NOTIFICATION DE COMMANDE APPROUVÉE:');
  
  try {
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    
    const nouvelleNotification = {
      id: Date.now() + Math.random(),
      type: 'success',
      title: 'Commande Approuvée ! 🎉',
      message: 'Votre commande TEST-001 a été approuvée. Vous pouvez maintenant télécharger votre facture.',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false,
      orderId: 'test-order-001'
    };
    
    notifications.unshift(nouvelleNotification);
    localStorage.setItem('client_notifications', JSON.stringify(notifications));
    
    console.log('✅ Notification simulée créée');
    console.log(`🔔 Total notifications: ${notifications.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale de création rapide
const creationRapideEspaceClient = async () => {
  console.log('🚀 DÉMARRAGE DE LA CRÉATION RAPIDE...');
  
  // 1. Vérifier l'accès
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ACCÈS');
  console.log('='.repeat(50));
  const acces = verifierAccesEspaceClient();
  
  if (!acces.userConnected) {
    console.log('\n❌ UTILISATEUR NON CONNECTÉ!');
    console.log('💡 Connectez-vous d\'abord pour accéder à l\'espace client');
    return;
  }
  
  // 2. Créer le système complet de test
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ CRÉATION DU SYSTÈME COMPLET');
  console.log('='.repeat(50));
  const resultat = await creerSystemeCompletTest();
  
  // 3. Créer un lien direct
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ CRÉATION D\'UN LIEN DIRECT');
  console.log('='.repeat(50));
  creerLienDirectEspaceClient();
  
  // 4. Simuler une notification
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ SIMULATION D\'UNE NOTIFICATION');
  console.log('='.repeat(50));
  simulerNotificationCommandeApprouvee();
  
  // 5. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA CRÉATION RAPIDE');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Utilisateur connecté: ${acces.userConnected ? '✅' : '❌'}`);
  console.log(`- Commandes totales: ${acces.totalOrders}`);
  console.log(`- Notifications: ${acces.totalNotifications}`);
  
  if (resultat) {
    console.log(`- Commandes utilisateur: ${resultat.commandesUtilisateur}`);
    console.log(`- Commandes approuvées: ${resultat.commandesApprouvees}`);
    console.log(`- Notifications non lues: ${resultat.notificationsNonLues}`);
  }
  
  console.log('\n🎉 ESPACE CLIENT CRÉÉ AVEC SUCCÈS!');
  console.log('\n💡 Instructions:');
  console.log('1. Cliquez sur le bouton bleu "ALLER À MES COMMANDES" en haut à droite');
  console.log('2. Ou allez directement sur /orders dans l\'URL');
  console.log('3. Vous devriez voir vos commandes et pouvoir télécharger les factures');
  console.log('4. Vérifiez la cloche de notifications pour les alertes');
  
  console.log('\n🔧 Fonctions disponibles:');
  console.log('- verifierAccesEspaceClient() : Vérifier l\'accès');
  console.log('- creerSystemeCompletTest() : Créer le système complet');
  console.log('- creerLienDirectEspaceClient() : Créer un lien direct');
  console.log('- simulerNotificationCommandeApprouvee() : Simuler une notification');
};

// Exporter les fonctions
window.verifierAccesEspaceClient = verifierAccesEspaceClient;
window.creerSystemeCompletTest = creerSystemeCompletTest;
window.creerLienDirectEspaceClient = creerLienDirectEspaceClient;
window.simulerNotificationCommandeApprouvee = simulerNotificationCommandeApprouvee;
window.creationRapideEspaceClient = creationRapideEspaceClient;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierAccesEspaceClient() : Vérifier l\'accès à l\'espace client');
console.log('- creerSystemeCompletTest() : Créer le système complet de test');
console.log('- creerLienDirectEspaceClient() : Créer un lien direct');
console.log('- simulerNotificationCommandeApprouvee() : Simuler une notification');
console.log('- creationRapideEspaceClient() : Création rapide complète');

// Exécuter automatiquement
creationRapideEspaceClient();
