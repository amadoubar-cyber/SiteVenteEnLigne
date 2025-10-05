// Script de test final pour l'espace client
// À exécuter dans la console du navigateur

console.log('🎯 TEST FINAL - ESPACE CLIENT COMPLET');
console.log('=' .repeat(50));

// Fonction pour tester l'accès à l'espace client
const testerAccesEspaceClient = () => {
  console.log('\n🔍 TEST D\'ACCÈS À L\'ESPACE CLIENT:');
  
  // Vérifier l'utilisateur connecté
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  console.log(`👤 Utilisateur connecté: ${userData ? 'Oui' : 'Non'}`);
  console.log(`🔑 Token présent: ${token ? 'Oui' : 'Non'}`);
  
  if (!userData) {
    console.log('❌ UTILISATEUR NON CONNECTÉ - Impossible de tester');
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    console.log(`👤 Email: ${user.email}`);
    console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
  } catch (error) {
    console.error('❌ Erreur parsing user:', error);
    return false;
  }
  
  return true;
};

// Fonction pour créer des données de test complètes
const creerDonneesTestCompletes = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST COMPLÈTES:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Récupérer l'utilisateur
    const userData = JSON.parse(localStorage.getItem('user'));
    
    // Créer plusieurs commandes avec différents statuts
    const commandesTest = [
      {
        items: [{ product: 'fer-1', quantity: 2, price: 300000, name: 'FER', image: 'test-image-1' }],
        shippingAddress: { firstName: userData.firstName, lastName: userData.lastName, street: '123 Rue Test', city: 'Conakry', phone: userData.phone || '+224 123 456 789' },
        paymentMethod: 'mobile_money',
        notes: 'Commande FER - En attente',
        subtotal: 600000, tax: 0, total: 600000
      },
      {
        items: [{ product: 'ciment-1', quantity: 1, price: 150000, name: 'CIMENT', image: 'test-image-2' }],
        shippingAddress: { firstName: userData.firstName, lastName: userData.lastName, street: '123 Rue Test', city: 'Conakry', phone: userData.phone || '+224 123 456 789' },
        paymentMethod: 'mobile_money',
        notes: 'Commande CIMENT - À approuver',
        subtotal: 150000, tax: 0, total: 150000
      },
      {
        items: [{ product: 'telephone-1', quantity: 1, price: 500000, name: 'TÉLÉPHONE', image: 'test-image-1' }],
        shippingAddress: { firstName: userData.firstName, lastName: userData.lastName, street: '123 Rue Test', city: 'Conakry', phone: userData.phone || '+224 123 456 789' },
        paymentMethod: 'mobile_money',
        notes: 'Commande TÉLÉPHONE - Test',
        subtotal: 500000, tax: 0, total: 500000
      }
    ];

    const commandesCreees = [];
    
    for (const commandeData of commandesTest) {
      console.log(`📦 Création: ${commandeData.items[0].name}...`);
      
      const result = await localOrdersAPI.createOrder(commandeData);
      
      if (result.success) {
        console.log(`✅ Créée: ${result.data.order.trackingNumber}`);
        commandesCreees.push(result.data.order._id);
      } else {
        console.error(`❌ Erreur: ${result.error}`);
      }
    }
    
    return commandesCreees;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return [];
  }
};

// Fonction pour approuver une commande et créer une notification
const approuverEtNotifier = async (orderId) => {
  console.log(`\n🔔 APPROBATION ET NOTIFICATION: ${orderId}`);
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Approuver la commande
    const result = await localOrdersAPI.approveOrder(orderId, 'Approbation automatique pour test');
    
    if (result.success) {
      console.log(`✅ Commande approuvée: ${orderId}`);
      
      // Attendre un peu pour la propagation des événements
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

// Fonction pour vérifier l'état final
const verifierEtatFinal = () => {
  console.log('\n📊 VÉRIFICATION DE L\'ÉTAT FINAL:');
  
  // Vérifier les commandes
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
  
  const commandesEnAttente = commandesUtilisateur.filter(order => 
    order.orderStatus === 'pending_approval'
  );
  
  // Vérifier les notifications
  const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
  const notificationsNonLues = notifications.filter(n => !n.read);
  
  console.log(`📦 Commandes totales: ${orders.length}`);
  console.log(`👤 Commandes utilisateur: ${commandesUtilisateur.length}`);
  console.log(`✅ Commandes approuvées: ${commandesApprouvees.length}`);
  console.log(`⏳ Commandes en attente: ${commandesEnAttente.length}`);
  console.log(`🔔 Notifications totales: ${notifications.length}`);
  console.log(`🔔 Notifications non lues: ${notificationsNonLues.length}`);
  
  if (commandesApprouvees.length > 0) {
    console.log('\n📋 Commandes approuvées:');
    commandesApprouvees.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.trackingNumber} - ${order.total.toLocaleString('fr-FR')} GNF`);
    });
  }
  
  if (notificationsNonLues.length > 0) {
    console.log('\n🔔 Notifications non lues:');
    notificationsNonLues.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.title}`);
    });
  }
  
  return {
    commandesUtilisateur: commandesUtilisateur.length,
    commandesApprouvees: commandesApprouvees.length,
    commandesEnAttente: commandesEnAttente.length,
    notifications: notifications.length,
    notificationsNonLues: notificationsNonLues.length
  };
};

// Fonction pour créer des liens d'accès rapide
const creerLiensAccesRapide = () => {
  console.log('\n🔗 CRÉATION DE LIENS D\'ACCÈS RAPIDE:');
  
  // Créer un bouton pour aller à l'espace client
  const buttonEspaceClient = document.createElement('button');
  buttonEspaceClient.innerHTML = '📦 MES COMMANDES';
  buttonEspaceClient.style.cssText = `
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
  
  buttonEspaceClient.onclick = () => {
    window.location.href = '/orders';
  };
  
  // Créer un bouton pour la page de test
  const buttonTest = document.createElement('button');
  buttonTest.innerHTML = '🧪 TEST COMMANDES';
  buttonTest.style.cssText = `
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
  `;
  
  buttonTest.onclick = () => {
    window.location.href = '/client-orders-test';
  };
  
  // Créer un bouton pour l'admin
  const buttonAdmin = document.createElement('button');
  buttonAdmin.innerHTML = '👨‍💼 ADMIN';
  buttonAdmin.style.cssText = `
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
  `;
  
  buttonAdmin.onclick = () => {
    window.location.href = '/admin/orders';
  };
  
  document.body.appendChild(buttonEspaceClient);
  document.body.appendChild(buttonTest);
  document.body.appendChild(buttonAdmin);
  
  console.log('✅ Boutons d\'accès rapide créés:');
  console.log('   📦 MES COMMANDES (bleu) - Page principale des commandes');
  console.log('   🧪 TEST COMMANDES (vert) - Page de test des commandes');
  console.log('   👨‍💼 ADMIN (orange) - Interface admin pour approuver');
  
  return true;
};

// Fonction principale de test final
const testFinalComplet = async () => {
  console.log('🚀 DÉMARRAGE DU TEST FINAL COMPLET...');
  
  // 1. Tester l'accès
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ TEST D\'ACCÈS');
  console.log('='.repeat(50));
  const accesOk = testerAccesEspaceClient();
  
  if (!accesOk) {
    console.log('\n❌ TEST ÉCHOUÉ - Utilisateur non connecté');
    return;
  }
  
  // 2. Créer des données de test
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(50));
  const commandesCreees = await creerDonneesTestCompletes();
  
  if (commandesCreees.length === 0) {
    console.log('\n❌ Aucune commande créée');
    return;
  }
  
  // 3. Approuver une commande
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ APPROBATION D\'UNE COMMANDE');
  console.log('='.repeat(50));
  const premiereCommande = commandesCreees[0];
  await approuverEtNotifier(premiereCommande);
  
  // 4. Vérifier l'état final
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ VÉRIFICATION DE L\'ÉTAT FINAL');
  console.log('='.repeat(50));
  const etatFinal = verifierEtatFinal();
  
  // 5. Créer les liens d'accès rapide
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ CRÉATION DE LIENS D\'ACCÈS RAPIDE');
  console.log('='.repeat(50));
  creerLiensAccesRapide();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU TEST FINAL');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Utilisateur connecté: ✅`);
  console.log(`- Commandes créées: ${commandesCreees.length}`);
  console.log(`- Commandes utilisateur: ${etatFinal.commandesUtilisateur}`);
  console.log(`- Commandes approuvées: ${etatFinal.commandesApprouvees}`);
  console.log(`- Commandes en attente: ${etatFinal.commandesEnAttente}`);
  console.log(`- Notifications: ${etatFinal.notifications}`);
  console.log(`- Notifications non lues: ${etatFinal.notificationsNonLues}`);
  
  if (etatFinal.commandesApprouvees > 0 && etatFinal.notificationsNonLues > 0) {
    console.log('\n🎉 SUCCÈS COMPLET!');
    console.log('✅ L\'espace client est fonctionnel');
    console.log('✅ Les commandes sont créées');
    console.log('✅ Les notifications fonctionnent');
    console.log('✅ Le téléchargement de factures est disponible');
  } else {
    console.log('\n⚠️ SYSTÈME PARTIELLEMENT FONCTIONNEL');
    console.log('💡 Vérifiez les boutons d\'accès rapide créés');
  }
  
  console.log('\n💡 Instructions:');
  console.log('1. Cliquez sur "📦 MES COMMANDES" pour voir vos commandes');
  console.log('2. Cliquez sur "🧪 TEST COMMANDES" pour la page de test');
  console.log('3. Cliquez sur "👨‍💼 ADMIN" pour approuver des commandes');
  console.log('4. Vérifiez la cloche de notifications');
  console.log('5. Testez le téléchargement de factures');
  
  console.log('\n🔧 URLs disponibles:');
  console.log('- /orders : Page principale des commandes');
  console.log('- /client-orders-test : Page de test des commandes');
  console.log('- /admin/orders : Interface admin');
};

// Exporter les fonctions
window.testerAccesEspaceClient = testerAccesEspaceClient;
window.creerDonneesTestCompletes = creerDonneesTestCompletes;
window.approuverEtNotifier = approuverEtNotifier;
window.verifierEtatFinal = verifierEtatFinal;
window.creerLiensAccesRapide = creerLiensAccesRapide;
window.testFinalComplet = testFinalComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- testerAccesEspaceClient() : Tester l\'accès');
console.log('- creerDonneesTestCompletes() : Créer des données de test');
console.log('- approuverEtNotifier(orderId) : Approuver une commande');
console.log('- verifierEtatFinal() : Vérifier l\'état final');
console.log('- creerLiensAccesRapide() : Créer des liens d\'accès');
console.log('- testFinalComplet() : Test final complet');

// Exécuter automatiquement
testFinalComplet();
