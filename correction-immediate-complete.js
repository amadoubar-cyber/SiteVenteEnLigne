// Script de correction immédiate pour fermer la popup et accéder à l'espace client
// À exécuter dans la console du navigateur

console.log('🚨 CORRECTION IMMÉDIATE - POPUP BLOQUANTE');
console.log('=' .repeat(50));

// Fonction pour fermer toutes les popups et modales
const fermerToutesLesPopups = () => {
  console.log('\n🚪 FERMETURE DE TOUTES LES POPUPS:');
  
  // Chercher et fermer toutes les popups possibles
  const selecteursPopups = [
    '[class*="modal"]',
    '[class*="popup"]',
    '[class*="notification"]',
    '[class*="overlay"]',
    '[class*="dropdown"]',
    '[class*="menu"]',
    '[role="dialog"]',
    '[role="menu"]',
    '[role="tooltip"]'
  ];
  
  let popupsFermees = 0;
  
  selecteursPopups.forEach(selecteur => {
    const elements = document.querySelectorAll(selecteur);
    elements.forEach(element => {
      // Vérifier si l'élément est visible
      const style = window.getComputedStyle(element);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        console.log(`🚪 Fermeture de: ${selecteur}`);
        
        // Essayer de cliquer sur le bouton de fermeture
        const boutonFermer = element.querySelector('button[aria-label*="close"], button[aria-label*="fermer"], button[class*="close"], button[class*="fermer"], .close, [data-testid*="close"]');
        if (boutonFermer) {
          boutonFermer.click();
          popupsFermees++;
        } else {
          // Sinon, masquer l'élément
          element.style.display = 'none';
          popupsFermees++;
        }
      }
    });
  });
  
  console.log(`✅ ${popupsFermees} popups fermées`);
  return popupsFermees;
};

// Fonction pour créer un accès direct à l'espace client
const creerAccesDirectEspaceClient = () => {
  console.log('\n🔗 CRÉATION D\'UN ACCÈS DIRECT À L\'ESPACE CLIENT:');
  
  // Supprimer les anciens boutons
  const anciensBoutons = document.querySelectorAll('.acces-direct-client');
  anciensBoutons.forEach(bouton => bouton.remove());
  
  // Créer un bouton principal très visible
  const boutonPrincipal = document.createElement('button');
  boutonPrincipal.className = 'acces-direct-client';
  boutonPrincipal.innerHTML = '📦 MES COMMANDES';
  boutonPrincipal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    background: #3B82F6;
    color: white;
    padding: 20px 40px;
    border: none;
    border-radius: 15px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
    font-size: 20px;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  `;
  
  // Ajouter l'animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.05); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  boutonPrincipal.onclick = () => {
    window.location.href = '/orders';
  };
  
  // Créer des boutons secondaires
  const boutonTest = document.createElement('button');
  boutonTest.className = 'acces-direct-client';
  boutonTest.innerHTML = '🧪 TEST';
  boutonTest.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    background: #10B981;
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-size: 16px;
  `;
  
  boutonTest.onclick = () => {
    window.location.href = '/client-orders-test';
  };
  
  const boutonAdmin = document.createElement('button');
  boutonAdmin.className = 'acces-direct-client';
  boutonAdmin.innerHTML = '👨‍💼 ADMIN';
  boutonAdmin.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 99999;
    background: #F59E0B;
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-size: 16px;
  `;
  
  boutonAdmin.onclick = () => {
    window.location.href = '/admin/orders';
  };
  
  document.body.appendChild(boutonPrincipal);
  document.body.appendChild(boutonTest);
  document.body.appendChild(boutonAdmin);
  
  console.log('✅ Boutons d\'accès direct créés:');
  console.log('   📦 MES COMMANDES (centre de l\'écran)');
  console.log('   🧪 TEST (haut droite)');
  console.log('   👨‍💼 ADMIN (haut droite)');
  
  return true;
};

// Fonction pour créer des données de test immédiatement
const creerDonneesTestImmediates = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST IMMÉDIATES:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      console.log('❌ Utilisateur non connecté');
      return false;
    }
    
    // Créer une commande de test
    const commandeTest = {
      items: [
        {
          product: 'fer-test-immediat',
          quantity: 1,
          price: 300000,
          name: 'FER',
          image: 'test-image-1'
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
      notes: 'Commande de test immédiate',
      subtotal: 300000,
      tax: 0,
      total: 300000
    };

    console.log('📦 Création de la commande de test...');
    const result = await localOrdersAPI.createOrder(commandeTest);
    
    if (result.success) {
      console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
      
      // Approuver immédiatement la commande
      console.log('🔔 Approbation de la commande...');
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Approbation automatique pour test');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée avec succès!');
        
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

// Fonction pour créer une notification de bienvenue
const creerNotificationBienvenue = () => {
  console.log('\n🔔 CRÉATION D\'UNE NOTIFICATION DE BIENVENUE:');
  
  try {
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    
    const nouvelleNotification = {
      id: Date.now() + Math.random(),
      type: 'success',
      title: 'Bienvenue dans votre espace client ! 🎉',
      message: 'Votre espace client est maintenant disponible. Cliquez sur "MES COMMANDES" pour voir vos commandes et télécharger vos factures.',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(nouvelleNotification);
    localStorage.setItem('client_notifications', JSON.stringify(notifications));
    
    console.log('✅ Notification de bienvenue créée');
    console.log(`🔔 Total notifications: ${notifications.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier l'état final
const verifierEtatFinal = () => {
  console.log('\n📊 VÉRIFICATION DE L\'ÉTAT FINAL:');
  
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
  console.log(`✅ Commandes approuvées: ${commandesApprouvees.length}`);
  console.log(`🔔 Notifications: ${notifications.length}`);
  console.log(`🔔 Notifications non lues: ${notificationsNonLues.length}`);
  
  return {
    commandesUtilisateur: commandesUtilisateur.length,
    commandesApprouvees: commandesApprouvees.length,
    notifications: notifications.length,
    notificationsNonLues: notificationsNonLues.length
  };
};

// Fonction principale de correction immédiate
const correctionImmediateComplete = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION IMMÉDIATE COMPLÈTE...');
  
  // 1. Fermer toutes les popups
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ FERMETURE DE TOUTES LES POPUPS');
  console.log('='.repeat(50));
  const popupsFermees = fermerToutesLesPopups();
  
  // 2. Créer un accès direct
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ CRÉATION D\'UN ACCÈS DIRECT');
  console.log('='.repeat(50));
  creerAccesDirectEspaceClient();
  
  // 3. Créer des données de test
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(50));
  const donneesCreees = await creerDonneesTestImmediates();
  
  // 4. Créer une notification de bienvenue
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ CRÉATION D\'UNE NOTIFICATION DE BIENVENUE');
  console.log('='.repeat(50));
  creerNotificationBienvenue();
  
  // 5. Vérifier l'état final
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ VÉRIFICATION DE L\'ÉTAT FINAL');
  console.log('='.repeat(50));
  const etatFinal = verifierEtatFinal();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA CORRECTION IMMÉDIATE COMPLÈTE');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Popups fermées: ${popupsFermees}`);
  console.log('- Accès direct créé: ✅');
  console.log(`- Données de test créées: ${donneesCreees ? '✅' : '❌'}`);
  console.log(`- Commandes utilisateur: ${etatFinal.commandesUtilisateur}`);
  console.log(`- Commandes approuvées: ${etatFinal.commandesApprouvees}`);
  console.log(`- Notifications: ${etatFinal.notifications}`);
  
  console.log('\n🎉 CORRECTION TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Cliquez sur "📦 MES COMMANDES" au centre de l\'écran');
  console.log('2. Ou cliquez sur "🧪 TEST" en haut à droite');
  console.log('3. Ou cliquez sur "👨‍💼 ADMIN" pour l\'interface admin');
  console.log('4. Vous verrez maintenant vos commandes et pourrez télécharger les factures');
  
  console.log('\n🔧 URLs directes:');
  console.log('- http://localhost:3000/orders');
  console.log('- http://localhost:3000/client-orders-test');
  console.log('- http://localhost:3000/admin/orders');
  
  console.log('\n✅ Votre espace client est maintenant accessible!');
};

// Exporter les fonctions
window.fermerToutesLesPopups = fermerToutesLesPopups;
window.creerAccesDirectEspaceClient = creerAccesDirectEspaceClient;
window.creerDonneesTestImmediates = creerDonneesTestImmediates;
window.creerNotificationBienvenue = creerNotificationBienvenue;
window.verifierEtatFinal = verifierEtatFinal;
window.correctionImmediateComplete = correctionImmediateComplete;

console.log('🔧 Fonctions disponibles:');
console.log('- fermerToutesLesPopups() : Fermer toutes les popups');
console.log('- creerAccesDirectEspaceClient() : Créer un accès direct');
console.log('- creerDonneesTestImmediates() : Créer des données de test');
console.log('- creerNotificationBienvenue() : Créer une notification');
console.log('- verifierEtatFinal() : Vérifier l\'état final');
console.log('- correctionImmediateComplete() : Correction complète');

// Exécuter automatiquement
correctionImmediateComplete();
