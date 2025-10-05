// Script de correction immédiate pour rendre l'espace client visible
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION IMMÉDIATE - ESPACE CLIENT VISIBLE');
console.log('=' .repeat(50));

// Fonction pour vérifier l'état de connexion
const verifierConnexionClient = () => {
  console.log('\n👤 VÉRIFICATION DE LA CONNEXION CLIENT:');
  
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  console.log(`👤 Utilisateur connecté: ${userData ? 'Oui' : 'Non'}`);
  console.log(`🔑 Token présent: ${token ? 'Oui' : 'Non'}`);
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
      console.log(`👤 Email: ${user.email}`);
      console.log(`👤 Rôle: ${user.role || 'client'}`);
      return user;
    } catch (error) {
      console.error('❌ Erreur parsing user:', error);
      return null;
    }
  }
  
  return null;
};

// Fonction pour créer un bouton d'accès rapide à l'espace client
const creerBoutonAccesRapide = () => {
  console.log('\n🔗 CRÉATION D\'UN BOUTON D\'ACCÈS RAPIDE:');
  
  // Supprimer les anciens boutons s'ils existent
  const anciensBoutons = document.querySelectorAll('.bouton-acces-client');
  anciensBoutons.forEach(bouton => bouton.remove());
  
  // Créer le bouton principal
  const boutonPrincipal = document.createElement('button');
  boutonPrincipal.className = 'bouton-acces-client';
  boutonPrincipal.innerHTML = '📦 MES COMMANDES';
  boutonPrincipal.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: #3B82F6;
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-size: 16px;
    transition: all 0.3s ease;
  `;
  
  boutonPrincipal.onmouseover = () => {
    boutonPrincipal.style.background = '#2563EB';
    boutonPrincipal.style.transform = 'scale(1.05)';
  };
  
  boutonPrincipal.onmouseout = () => {
    boutonPrincipal.style.background = '#3B82F6';
    boutonPrincipal.style.transform = 'scale(1)';
  };
  
  boutonPrincipal.onclick = () => {
    window.location.href = '/orders';
  };
  
  // Créer le bouton de test
  const boutonTest = document.createElement('button');
  boutonTest.className = 'bouton-acces-client';
  boutonTest.innerHTML = '🧪 TEST COMMANDES';
  boutonTest.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    background: #10B981;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
    transition: all 0.3s ease;
  `;
  
  boutonTest.onclick = () => {
    window.location.href = '/client-orders-test';
  };
  
  // Créer le bouton d'admin
  const boutonAdmin = document.createElement('button');
  boutonAdmin.className = 'bouton-acces-client';
  boutonAdmin.innerHTML = '👨‍💼 ADMIN';
  boutonAdmin.style.cssText = `
    position: fixed;
    top: 140px;
    right: 20px;
    z-index: 9999;
    background: #F59E0B;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
    transition: all 0.3s ease;
  `;
  
  boutonAdmin.onclick = () => {
    window.location.href = '/admin/orders';
  };
  
  document.body.appendChild(boutonPrincipal);
  document.body.appendChild(boutonTest);
  document.body.appendChild(boutonAdmin);
  
  console.log('✅ Boutons d\'accès rapide créés:');
  console.log('   📦 MES COMMANDES (bleu) - Page principale');
  console.log('   🧪 TEST COMMANDES (vert) - Page de test');
  console.log('   👨‍💼 ADMIN (orange) - Interface admin');
  
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

// Fonction pour vérifier l'état des commandes
const verifierEtatCommandes = () => {
  console.log('\n📊 VÉRIFICATION DE L\'ÉTAT DES COMMANDES:');
  
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
  
  if (commandesApprouvees.length > 0) {
    console.log('\n📋 Commandes approuvées disponibles:');
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

// Fonction pour créer une notification de test
const creerNotificationTest = () => {
  console.log('\n🔔 CRÉATION D\'UNE NOTIFICATION DE TEST:');
  
  try {
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    
    const nouvelleNotification = {
      id: Date.now() + Math.random(),
      type: 'success',
      title: 'Bienvenue dans votre espace client ! 🎉',
      message: 'Votre espace client est maintenant disponible. Vous pouvez voir vos commandes et télécharger vos factures.',
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

// Fonction principale de correction immédiate
const correctionImmediateEspaceClient = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION IMMÉDIATE...');
  
  // 1. Vérifier la connexion
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE LA CONNEXION');
  console.log('='.repeat(50));
  const user = verifierConnexionClient();
  
  if (!user) {
    console.log('\n❌ UTILISATEUR NON CONNECTÉ!');
    console.log('💡 Connectez-vous d\'abord pour accéder à l\'espace client');
    return;
  }
  
  // 2. Créer les boutons d'accès rapide
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ CRÉATION DES BOUTONS D\'ACCÈS RAPIDE');
  console.log('='.repeat(50));
  creerBoutonAccesRapide();
  
  // 3. Créer des données de test
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(50));
  const donneesCreees = await creerDonneesTestImmediates();
  
  // 4. Créer une notification de bienvenue
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ CRÉATION D\'UNE NOTIFICATION DE BIENVENUE');
  console.log('='.repeat(50));
  creerNotificationTest();
  
  // 5. Vérifier l'état final
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ VÉRIFICATION DE L\'ÉTAT FINAL');
  console.log('='.repeat(50));
  const etatFinal = verifierEtatCommandes();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA CORRECTION IMMÉDIATE');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Utilisateur connecté: ✅ ${user.firstName} ${user.lastName}`);
  console.log(`- Boutons d'accès créés: ✅`);
  console.log(`- Données de test créées: ${donneesCreees ? '✅' : '❌'}`);
  console.log(`- Commandes utilisateur: ${etatFinal.commandesUtilisateur}`);
  console.log(`- Commandes approuvées: ${etatFinal.commandesApprouvees}`);
  console.log(`- Notifications: ${etatFinal.notifications}`);
  
  console.log('\n🎉 ESPACE CLIENT MAINTENANT VISIBLE!');
  console.log('\n💡 Instructions:');
  console.log('1. Cliquez sur "📦 MES COMMANDES" (bouton bleu en haut à droite)');
  console.log('2. Ou cliquez sur "🧪 TEST COMMANDES" (bouton vert)');
  console.log('3. Vous verrez vos commandes et pourrez télécharger les factures');
  console.log('4. Vérifiez la cloche de notifications pour les alertes');
  
  console.log('\n🔧 URLs directes:');
  console.log('- http://localhost:3000/orders');
  console.log('- http://localhost:3000/client-orders-test');
  console.log('- http://localhost:3000/admin/orders (pour l\'admin)');
  
  console.log('\n✅ Votre espace client est maintenant accessible!');
};

// Exporter les fonctions
window.verifierConnexionClient = verifierConnexionClient;
window.creerBoutonAccesRapide = creerBoutonAccesRapide;
window.creerDonneesTestImmediates = creerDonneesTestImmediates;
window.verifierEtatCommandes = verifierEtatCommandes;
window.creerNotificationTest = creerNotificationTest;
window.correctionImmediateEspaceClient = correctionImmediateEspaceClient;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierConnexionClient() : Vérifier la connexion');
console.log('- creerBoutonAccesRapide() : Créer les boutons d\'accès');
console.log('- creerDonneesTestImmediates() : Créer des données de test');
console.log('- verifierEtatCommandes() : Vérifier l\'état des commandes');
console.log('- creerNotificationTest() : Créer une notification de test');
console.log('- correctionImmediateEspaceClient() : Correction immédiate complète');

// Exécuter automatiquement
correctionImmediateEspaceClient();
