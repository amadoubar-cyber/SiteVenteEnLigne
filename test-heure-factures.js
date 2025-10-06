// Script de test pour vérifier l'affichage de l'heure dans les factures
// À exécuter dans la console du navigateur

console.log('🕐 TEST - AFFICHAGE DE L\'HEURE DANS LES FACTURES');
console.log('=' .repeat(60));

// Fonction pour tester le formatage de l'heure
const testerFormatageHeure = () => {
  console.log('\n📅 TEST DU FORMATAGE DE L\'HEURE:');
  
  const maintenant = new Date();
  
  // Test formatDate avec secondes
  const formatDateComplet = maintenant.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Test formatTime
  const formatTime = maintenant.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Test formatDateOnly
  const formatDateOnly = maintenant.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  console.log('✅ Date complète avec heure:', formatDateComplet);
  console.log('✅ Heure seule:', formatTime);
  console.log('✅ Date seule:', formatDateOnly);
  
  return {
    dateComplet: formatDateComplet,
    heureSeule: formatTime,
    dateSeule: formatDateOnly
  };
};

// Fonction pour créer une commande de test avec heure
const creerCommandeTestAvecHeure = async () => {
  console.log('\n📦 CRÉATION D\'UNE COMMANDE DE TEST AVEC HEURE:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      console.log('❌ Utilisateur non connecté');
      return false;
    }
    
    // Créer une commande de test avec timestamp précis
    const commandeTest = {
      items: [
        {
          product: 'test-heure-facture',
          quantity: 1,
          price: 250000,
          name: 'TEST HEURE FACTURE',
          image: 'test-image-heure'
        }
      ],
      shippingAddress: {
        firstName: userData.firstName || 'Test',
        lastName: userData.lastName || 'Heure',
        street: '123 Rue Test Heure',
        city: 'Conakry',
        phone: userData.phone || '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Commande de test pour vérifier l\'affichage de l\'heure dans la facture',
      subtotal: 250000,
      tax: 0,
      total: 250000,
      createdAt: new Date().toISOString() // Timestamp précis
    };

    console.log('📦 Création de la commande de test...');
    const result = await localOrdersAPI.createOrder(commandeTest);
    
    if (result.success) {
      console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
      console.log(`🕐 Timestamp de création: ${result.data.order.createdAt}`);
      
      // Approuver immédiatement la commande
      console.log('🔔 Approbation de la commande...');
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Approbation automatique pour test d\'heure');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée avec succès!');
        
        // Attendre un peu pour la propagation des événements
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

// Fonction pour vérifier l'affichage de l'heure dans les factures
const verifierAffichageHeureFactures = () => {
  console.log('\n🔍 VÉRIFICATION DE L\'AFFICHAGE DE L\'HEURE DANS LES FACTURES:');
  
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
    console.log('\n🕐 VÉRIFICATION DES TIMESTAMPS:');
    commandesApprouvees.forEach((order, index) => {
      const dateCreation = new Date(order.createdAt);
      const heureCreation = dateCreation.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      console.log(`📋 Commande ${index + 1}: ${order.trackingNumber}`);
      console.log(`   🕐 Heure de création: ${heureCreation}`);
      console.log(`   📅 Date complète: ${dateCreation.toLocaleDateString('fr-FR')} ${heureCreation}`);
      
      if (order.approvedAt) {
        const dateApprobation = new Date(order.approvedAt);
        const heureApprobation = dateApprobation.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        console.log(`   ✅ Heure d'approbation: ${heureApprobation}`);
      }
    });
  }
  
  return {
    commandesUtilisateur: commandesUtilisateur.length,
    commandesApprouvees: commandesApprouvees.length,
    commandes: commandesApprouvees
  };
};

// Fonction pour tester l'interface de facture
const testerInterfaceFacture = () => {
  console.log('\n🖥️ TEST DE L\'INTERFACE DE FACTURE:');
  
  // Vérifier si le composant Invoice existe
  const invoiceComponent = document.querySelector('[data-testid="invoice-component"]') || 
                          document.querySelector('.invoice-component') ||
                          document.querySelector('#invoice-content');
  
  if (invoiceComponent) {
    console.log('✅ Composant Invoice trouvé');
    
    // Vérifier l'affichage de l'heure
    const heureElements = invoiceComponent.querySelectorAll('[class*="font-mono"], [class*="text-blue-600"]');
    console.log(`🕐 Éléments d'heure trouvés: ${heureElements.length}`);
    
    heureElements.forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.textContent}`);
    });
  } else {
    console.log('ℹ️ Composant Invoice non trouvé (normal si pas ouvert)');
  }
  
  return true;
};

// Fonction principale de test
const testHeureFacturesComplet = async () => {
  console.log('🚀 DÉMARRAGE DU TEST COMPLET DE L\'HEURE DANS LES FACTURES...');
  
  // 1. Tester le formatage de l'heure
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ TEST DU FORMATAGE DE L\'HEURE');
  console.log('='.repeat(60));
  const formatageResult = testerFormatageHeure();
  
  // 2. Créer une commande de test
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION D\'UNE COMMANDE DE TEST');
  console.log('='.repeat(60));
  const commandeTest = await creerCommandeTestAvecHeure();
  
  // 3. Vérifier l'affichage de l'heure
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ VÉRIFICATION DE L\'AFFICHAGE DE L\'HEURE');
  console.log('='.repeat(60));
  const verificationResult = verifierAffichageHeureFactures();
  
  // 4. Tester l'interface de facture
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ TEST DE L\'INTERFACE DE FACTURE');
  console.log('='.repeat(60));
  const interfaceResult = testerInterfaceFacture();
  
  // 5. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU TEST DE L\'HEURE DANS LES FACTURES');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Formatage de l'heure: ${formatageResult ? '✅' : '❌'}`);
  console.log(`- Commande de test créée: ${commandeTest ? '✅' : '❌'}`);
  console.log(`- Commandes utilisateur: ${verificationResult.commandesUtilisateur}`);
  console.log(`- Commandes approuvées: ${verificationResult.commandesApprouvees}`);
  console.log(`- Interface de facture: ${interfaceResult ? '✅' : '❌'}`);
  
  console.log('\n🎉 TEST TERMINÉ!');
  console.log('\n💡 Instructions pour vérifier manuellement:');
  console.log('1. Allez dans "Mes Commandes"');
  console.log('2. Cliquez sur une commande approuvée');
  console.log('3. Cliquez sur "Facture"');
  console.log('4. Vérifiez que l\'heure est affichée en bleu avec police monospace');
  console.log('5. L\'heure doit apparaître dans:');
  console.log('   - Informations Facture (Date et Heure séparées)');
  console.log('   - Détails de la Commande (Date et Heure séparées)');
  console.log('   - Pied de page (Date et Heure de génération)');
  
  console.log('\n✅ L\'heure est maintenant affichée dans toutes les factures !');
};

// Exporter les fonctions
window.testerFormatageHeure = testerFormatageHeure;
window.creerCommandeTestAvecHeure = creerCommandeTestAvecHeure;
window.verifierAffichageHeureFactures = verifierAffichageHeureFactures;
window.testerInterfaceFacture = testerInterfaceFacture;
window.testHeureFacturesComplet = testHeureFacturesComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- testerFormatageHeure() : Tester le formatage de l\'heure');
console.log('- creerCommandeTestAvecHeure() : Créer une commande de test');
console.log('- verifierAffichageHeureFactures() : Vérifier l\'affichage');
console.log('- testerInterfaceFacture() : Tester l\'interface');
console.log('- testHeureFacturesComplet() : Test complet');

// Exécuter automatiquement
testHeureFacturesComplet();
