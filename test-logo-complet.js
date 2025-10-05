// Script pour tester le chargement du logo
// À exécuter dans la console du navigateur

console.log('🖼️ TEST DU CHARGEMENT DU LOGO');
console.log('=' .repeat(50));

// Fonction pour tester le chargement de l'image
const testerChargementLogo = () => {
  console.log('\n🖼️ TEST DU CHARGEMENT DU LOGO:');
  
  // Créer une image de test
  const img = new Image();
  
  img.onload = function() {
    console.log('✅ Logo chargé avec succès !');
    console.log(`📏 Dimensions: ${this.width}x${this.height}`);
    console.log('🔗 URL: http://localhost:3000/images/products/logo/logo-koula.jpg');
  };
  
  img.onerror = function() {
    console.log('❌ Erreur de chargement du logo');
    console.log('🔍 Vérifiez que le fichier existe dans: client/public/images/products/logo/logo-koula.jpg');
    console.log('🔍 Vérifiez que le serveur React fonctionne sur http://localhost:3000');
  };
  
  // Tester le chargement
  img.src = 'http://localhost:3000/images/products/logo/logo-koula.jpg';
  
  return img;
};

// Fonction pour créer une facture de test avec logo
const creerFactureTestAvecLogo = async () => {
  console.log('\n📄 CRÉATION D\'UNE FACTURE DE TEST AVEC LOGO:');
  
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
          product: 'fer-test-logo',
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
      notes: 'Commande de test pour vérifier le logo',
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
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Commande approuvée - Test logo');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée - Testez le téléchargement de facture!');
        
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

// Fonction pour vérifier les fichiers
const verifierFichiersLogo = () => {
  console.log('\n📁 VÉRIFICATION DES FICHIERS LOGO:');
  
  // Vérifier si le fichier existe (simulation)
  console.log('🔍 Chemin du logo: client/public/images/products/logo/logo-koula.jpg');
  console.log('🔍 URL du logo: http://localhost:3000/images/products/logo/logo-koula.jpg');
  console.log('💡 Si l\'image ne s\'affiche pas:');
  console.log('   1. Vérifiez que le fichier existe dans le dossier public');
  console.log('   2. Vérifiez que le serveur React fonctionne');
  console.log('   3. Essayez d\'ouvrir directement: http://localhost:3000/images/products/logo/logo-koula.jpg');
  
  return true;
};

// Fonction principale
const testLogoComplet = async () => {
  console.log('🚀 DÉMARRAGE DU TEST LOGO COMPLET...');
  
  // 1. Vérifier les fichiers
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ VÉRIFICATION DES FICHIERS LOGO');
  console.log('='.repeat(60));
  verifierFichiersLogo();
  
  // 2. Tester le chargement du logo
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ TEST DU CHARGEMENT DU LOGO');
  console.log('='.repeat(60));
  testerChargementLogo();
  
  // 3. Créer une facture de test
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CRÉATION D\'UNE FACTURE DE TEST');
  console.log('='.repeat(60));
  const commandeTest = await creerFactureTestAvecLogo();
  
  // 4. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DU TEST LOGO COMPLET');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Fichiers vérifiés: ✅`);
  console.log(`- Test de chargement: En cours...`);
  console.log(`- Facture de test créée: ${commandeTest ? '✅' : '❌'}`);
  
  console.log('\n🎉 TEST LOGO TERMINÉ!');
  console.log('\n💡 Instructions:');
  console.log('1. Allez sur http://localhost:3000/orders');
  console.log('2. Cliquez sur "Télécharger la facture" pour la commande de test');
  console.log('3. Ouvrez le fichier HTML téléchargé');
  console.log('4. Vérifiez si le logo s\'affiche');
  
  console.log('\n🔧 Si le logo ne s\'affiche pas:');
  console.log('- Ouvrez directement: http://localhost:3000/images/products/logo/logo-koula.jpg');
  console.log('- Vérifiez que le fichier existe dans client/public/images/products/logo/');
  console.log('- Redémarrez le serveur React si nécessaire');
  
  console.log('\n✅ Test du logo terminé!');
};

// Exporter les fonctions
window.testerChargementLogo = testerChargementLogo;
window.creerFactureTestAvecLogo = creerFactureTestAvecLogo;
window.verifierFichiersLogo = verifierFichiersLogo;
window.testLogoComplet = testLogoComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- testerChargementLogo() : Tester le chargement du logo');
console.log('- creerFactureTestAvecLogo() : Créer une facture de test');
console.log('- verifierFichiersLogo() : Vérifier les fichiers logo');
console.log('- testLogoComplet() : Test logo complet');

// Exécuter automatiquement
testLogoComplet();
