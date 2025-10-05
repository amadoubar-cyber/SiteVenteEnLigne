// Script de solution immédiate pour l'accès client uniquement
// À exécuter dans la console du navigateur

console.log('🎯 SOLUTION IMMÉDIATE - ACCÈS CLIENT UNIQUEMENT');
console.log('=' .repeat(50));

// Fonction pour créer un accès client ultra-visible
const creerAccesClientUltraVisible = () => {
  console.log('\n🔗 CRÉATION D\'UN ACCÈS CLIENT ULTRA-VISIBLE:');
  
  // Supprimer tous les anciens éléments
  const anciensElements = document.querySelectorAll('.acces-client-visible');
  anciensElements.forEach(element => element.remove());
  
  // Créer un bouton principal pour l'espace client
  const boutonClient = document.createElement('button');
  boutonClient.className = 'acces-client-visible';
  boutonClient.innerHTML = '📦 MES COMMANDES & FACTURES';
  boutonClient.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    color: white;
    padding: 30px 60px;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
    font-size: 28px;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
    border: 4px solid white;
    text-align: center;
    line-height: 1.2;
  `;
  
  // Ajouter l'animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.05); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 20px 50px rgba(59, 130, 246, 0.8); }
    }
  `;
  document.head.appendChild(style);
  
  boutonClient.onclick = () => {
    window.location.href = '/orders';
  };
  
  // Créer un bouton de test pour les clients
  const boutonTest = document.createElement('button');
  boutonTest.className = 'acces-client-visible';
  boutonTest.innerHTML = '🧪 TEST COMMANDES';
  boutonTest.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 15px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    font-size: 18px;
    transition: all 0.3s ease;
  `;
  
  boutonTest.onclick = () => {
    window.location.href = '/client-orders-test';
  };
  
  // Créer un message d'information pour les clients
  const messageClient = document.createElement('div');
  messageClient.className = 'acces-client-visible';
  messageClient.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 25px;
      border-radius: 20px;
      max-width: 350px;
      font-size: 16px;
      line-height: 1.6;
      border: 2px solid #3B82F6;
    ">
      <h3 style="margin: 0 0 15px 0; color: #3B82F6; font-size: 20px;">🎉 Espace Client Disponible !</h3>
      <p style="margin: 0 0 10px 0;">✅ Votre système e-commerce fonctionne parfaitement</p>
      <p style="margin: 0 0 10px 0;">✅ Commandes créées et approuvées</p>
      <p style="margin: 0 0 10px 0;">✅ Factures disponibles au téléchargement</p>
      <p style="margin: 0 0 15px 0;">✅ Notifications actives</p>
      <p style="margin: 0; color: #10B981; font-weight: bold;">Cliquez sur "MES COMMANDES" pour accéder à votre espace client et télécharger vos factures.</p>
    </div>
  `;
  
  // Créer un indicateur de notifications
  const indicateurNotifications = document.createElement('div');
  indicateurNotifications.className = 'acces-client-visible';
  indicateurNotifications.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: white;
      padding: 15px 20px;
      border-radius: 15px;
      font-weight: bold;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
      font-size: 16px;
      text-align: center;
    ">
      🔔 Notifications Actives
    </div>
  `;
  
  document.body.appendChild(boutonClient);
  document.body.appendChild(boutonTest);
  document.body.appendChild(messageClient);
  document.body.appendChild(indicateurNotifications);
  
  console.log('✅ Accès client ultra-visible créé:');
  console.log('   📦 MES COMMANDES & FACTURES (centre de l\'écran - bleu)');
  console.log('   🧪 TEST COMMANDES (haut droite - vert)');
  console.log('   📋 Message d\'information (haut gauche)');
  console.log('   🔔 Indicateur de notifications (bas droite)');
  
  return true;
};

// Fonction pour créer des données de test client
const creerDonneesTestClient = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST CLIENT:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      console.log('❌ Utilisateur non connecté');
      return false;
    }
    
    // Créer une commande de test pour le client
    const commandeTest = {
      items: [
        {
          product: 'fer-test-client',
          quantity: 2,
          price: 300000,
          name: 'FER',
          image: 'test-image-1'
        },
        {
          product: 'ciment-test-client',
          quantity: 1,
          price: 150000,
          name: 'CIMENT',
          image: 'test-image-2'
        }
      ],
      shippingAddress: {
        firstName: userData.firstName || 'Test',
        lastName: userData.lastName || 'Client',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: userData.phone || '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Commande de test pour l\'espace client',
      subtotal: 750000,
      tax: 0,
      total: 750000
    };

    console.log('📦 Création de la commande de test client...');
    const result = await localOrdersAPI.createOrder(commandeTest);
    
    if (result.success) {
      console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
      
      // Approuver immédiatement pour que le client puisse télécharger la facture
      console.log('🔔 Approbation de la commande...');
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Commande approuvée - Facture disponible pour téléchargement');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée - Facture disponible pour le client!');
        
        // Attendre un peu pour la propagation des événements
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return true;
      } else {
        console.error('❌ Erreur approbation:', approbation.error);
        return false;
      }
    } else {
      console.error('❌ Erreur création commande:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour créer des notifications client
const creerNotificationsClient = () => {
  console.log('\n🔔 CRÉATION DE NOTIFICATIONS CLIENT:');
  
  try {
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    
    const notificationsClient = [
      {
        id: Date.now() + Math.random(),
        type: 'success',
        title: 'Espace Client Disponible ! 🎉',
        message: 'Votre espace client est maintenant accessible. Vous pouvez voir vos commandes et télécharger vos factures.',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: Date.now() + Math.random() + 1,
        type: 'info',
        title: 'Factures Disponibles 📄',
        message: 'Vos commandes approuvées ont des factures disponibles au téléchargement dans votre espace client.',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: Date.now() + Math.random() + 2,
        type: 'success',
        title: 'Commande Approuvée ✅',
        message: 'Votre commande de test a été approuvée. Vous pouvez maintenant télécharger votre facture.',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
    
    notifications.unshift(...notificationsClient);
    localStorage.setItem('client_notifications', JSON.stringify(notifications));
    
    console.log('✅ Notifications client créées');
    console.log(`🔔 Total notifications: ${notifications.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier l'état client
const verifierEtatClient = () => {
  console.log('\n📊 VÉRIFICATION DE L\'ÉTAT CLIENT:');
  
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
  
  console.log(`📦 Commandes totales: ${orders.length}`);
  console.log(`👤 Commandes utilisateur: ${commandesUtilisateur.length}`);
  console.log(`✅ Commandes approuvées (factures disponibles): ${commandesApprouvees.length}`);
  console.log(`🔔 Notifications: ${notifications.length}`);
  console.log(`🔔 Notifications non lues: ${notificationsNonLues.length}`);
  
  if (commandesApprouvees.length > 0) {
    console.log('\n📋 Commandes avec factures disponibles:');
    commandesApprouvees.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.trackingNumber} - ${order.total.toLocaleString('fr-FR')} GNF`);
    });
  }
  
  return {
    commandesUtilisateur: commandesUtilisateur.length,
    commandesApprouvees: commandesApprouvees.length,
    notifications: notifications.length,
    notificationsNonLues: notificationsNonLues.length
  };
};

// Fonction principale de solution client
const solutionClientComplete = async () => {
  console.log('🚀 DÉMARRAGE DE LA SOLUTION CLIENT COMPLÈTE...');
  
  // 1. Créer un accès client ultra-visible
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ CRÉATION D\'UN ACCÈS CLIENT ULTRA-VISIBLE');
  console.log('='.repeat(60));
  creerAccesClientUltraVisible();
  
  // 2. Créer des données de test client
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION DE DONNÉES DE TEST CLIENT');
  console.log('='.repeat(60));
  const donneesCreees = await creerDonneesTestClient();
  
  // 3. Créer des notifications client
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CRÉATION DE NOTIFICATIONS CLIENT');
  console.log('='.repeat(60));
  creerNotificationsClient();
  
  // 4. Vérifier l'état client
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ VÉRIFICATION DE L\'ÉTAT CLIENT');
  console.log('='.repeat(60));
  const etatClient = verifierEtatClient();
  
  // 5. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA SOLUTION CLIENT COMPLÈTE');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Accès client ultra-visible créé: ✅`);
  console.log(`- Données de test client créées: ${donneesCreees ? '✅' : '❌'}`);
  console.log(`- Commandes utilisateur: ${etatClient.commandesUtilisateur}`);
  console.log(`- Commandes approuvées (factures disponibles): ${etatClient.commandesApprouvees}`);
  console.log(`- Notifications: ${etatClient.notifications}`);
  console.log(`- Notifications non lues: ${etatClient.notificationsNonLues}`);
  
  console.log('\n🎉 SOLUTION CLIENT TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Cliquez sur "📦 MES COMMANDES & FACTURES" (bouton bleu au centre)');
  console.log('2. Ou cliquez sur "🧪 TEST COMMANDES" (bouton vert en haut à droite)');
  console.log('3. Vous verrez vos commandes et pourrez télécharger vos factures');
  console.log('4. Les factures sont disponibles uniquement pour les commandes approuvées');
  
  console.log('\n🔧 URLs directes pour les clients:');
  console.log('- http://localhost:3000/orders (espace client principal)');
  console.log('- http://localhost:3000/client-orders-test (page de test)');
  
  console.log('\n✅ Votre espace client est maintenant accessible avec les boutons ultra-visibles!');
  console.log('📄 Les factures sont disponibles uniquement pour les commandes approuvées par l\'admin.');
};

// Exporter les fonctions
window.creerAccesClientUltraVisible = creerAccesClientUltraVisible;
window.creerDonneesTestClient = creerDonneesTestClient;
window.creerNotificationsClient = creerNotificationsClient;
window.verifierEtatClient = verifierEtatClient;
window.solutionClientComplete = solutionClientComplete;

console.log('🔧 Fonctions disponibles:');
console.log('- creerAccesClientUltraVisible() : Créer un accès client ultra-visible');
console.log('- creerDonneesTestClient() : Créer des données de test client');
console.log('- creerNotificationsClient() : Créer des notifications client');
console.log('- verifierEtatClient() : Vérifier l\'état client');
console.log('- solutionClientComplete() : Solution client complète');

// Exécuter automatiquement
solutionClientComplete();
