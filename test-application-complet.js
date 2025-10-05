// Script pour tester le logo dans l'application
// À exécuter dans la console du navigateur

console.log('🖼️ TEST DU LOGO DANS L\'APPLICATION');
console.log('=' .repeat(50));

// Fonction pour tester le logo dans l'application
const testerLogoApplication = () => {
  console.log('\n🖼️ TEST DU LOGO DANS L\'APPLICATION:');
  
  // Vérifier si l'image du logo existe dans le DOM
  const logoImg = document.querySelector('img[alt="Bowoye Multi Services Logo"]');
  
  if (logoImg) {
    console.log('✅ Logo trouvé dans l\'application !');
    console.log(`🔗 Source: ${logoImg.src}`);
    console.log(`📏 Dimensions: ${logoImg.width}x${logoImg.height}`);
    
    // Tester si l'image se charge
    logoImg.onload = function() {
      console.log('✅ Logo chargé avec succès !');
    };
    
    logoImg.onerror = function() {
      console.log('❌ Erreur de chargement du logo');
      console.log('🔍 Vérifiez que le fichier existe dans: client/public/images/products/logo/logo-koula.jpg');
    };
    
    return true;
  } else {
    console.log('❌ Logo non trouvé dans l\'application');
    console.log('🔍 Vérifiez que le composant Header est chargé');
    return false;
  }
};

// Fonction pour créer des données de test
const creerDonneesTestSimple = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST SIMPLE:');
  
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
          product: 'fer-test-app',
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
      notes: 'Commande de test pour vérifier le logo dans l\'application',
      subtotal: 300000,
      tax: 0,
      total: 300000
    };

    console.log('📦 Création de la commande de test...');
    const result = await localOrdersAPI.createOrder(commandeTest);
    
    if (result.success) {
      console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
      
      // Approuver immédiatement
      console.log('🔔 Approbation de la commande...');
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Commande approuvée - Test logo application');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée !');
        
        // Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return result.data.order;
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

// Fonction pour vérifier l'état de l'application
const verifierEtatApplication = () => {
  console.log('\n📊 VÉRIFICATION DE L\'ÉTAT DE L\'APPLICATION:');
  
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
  
  console.log(`📦 Commandes totales: ${orders.length}`);
  console.log(`👤 Commandes utilisateur: ${commandesUtilisateur.length}`);
  console.log(`✅ Commandes approuvées: ${commandesApprouvees.length}`);
  
  if (commandesApprouvees.length > 0) {
    console.log('\n📋 Commandes avec factures disponibles:');
    commandesApprouvees.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.trackingNumber} - ${order.total.toLocaleString('fr-FR')} GNF`);
    });
  }
  
  return {
    commandesUtilisateur: commandesUtilisateur.length,
    commandesApprouvees: commandesApprouvees.length
  };
};

// Fonction principale
const testApplicationComplet = async () => {
  console.log('🚀 DÉMARRAGE DU TEST APPLICATION COMPLET...');
  
  // 1. Tester le logo dans l'application
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ TEST DU LOGO DANS L\'APPLICATION');
  console.log('='.repeat(60));
  const logoTrouve = testerLogoApplication();
  
  // 2. Créer des données de test
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(60));
  const commandeTest = await creerDonneesTestSimple();
  
  // 3. Vérifier l'état de l'application
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ VÉRIFICATION DE L\'ÉTAT DE L\'APPLICATION');
  console.log('='.repeat(60));
  const etatApplication = verifierEtatApplication();
  
  // 4. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DU TEST APPLICATION COMPLET');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Logo dans l'application: ${logoTrouve ? '✅' : '❌'}`);
  console.log(`- Données de test créées: ${commandeTest ? '✅' : '❌'}`);
  console.log(`- Commandes utilisateur: ${etatApplication.commandesUtilisateur}`);
  console.log(`- Commandes approuvées: ${etatApplication.commandesApprouvees}`);
  
  console.log('\n🎉 TEST APPLICATION TERMINÉ!');
  console.log('\n💡 Instructions:');
  console.log('1. Regardez en haut à gauche de l\'application');
  console.log('2. Vous devriez voir le logo de Bowoye Multi Services');
  console.log('3. Allez sur http://localhost:3000/orders');
  console.log('4. Cliquez sur "Télécharger la facture" pour une commande approuvée');
  console.log('5. Le logo devrait s\'afficher dans la facture téléchargée');
  
  console.log('\n🔧 Si le logo ne s\'affiche pas:');
  console.log('- Vérifiez que le fichier existe dans client/public/images/products/logo/logo-koula.jpg');
  console.log('- Redémarrez le serveur React');
  console.log('- Vérifiez la console pour les erreurs');
  
  console.log('\n✅ Test de l\'application terminé!');
};

// Exporter les fonctions
window.testerLogoApplication = testerLogoApplication;
window.creerDonneesTestSimple = creerDonneesTestSimple;
window.verifierEtatApplication = verifierEtatApplication;
window.testApplicationComplet = testApplicationComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- testerLogoApplication() : Tester le logo dans l\'application');
console.log('- creerDonneesTestSimple() : Créer des données de test simple');
console.log('- verifierEtatApplication() : Vérifier l\'état de l\'application');
console.log('- testApplicationComplet() : Test application complet');

// Exécuter automatiquement
testApplicationComplet();
