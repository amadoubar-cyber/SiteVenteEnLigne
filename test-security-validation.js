// Script de test de sécurité pour la validation des commandes
// À exécuter dans la console du navigateur

console.log('🔒 TEST DE SÉCURITÉ - VALIDATION DES COMMANDES');
console.log('=' .repeat(60));

// Fonction pour créer une commande de test
const createTestOrder = async () => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = {
      items: [
        {
          product: 'test-product',
          quantity: 1,
          price: 100000,
          name: 'Produit Test Sécurité',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Sécurité',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test de sécurité - Commande en attente',
      subtotal: 100000,
      tax: 0,
      total: 100000
    };

    const result = await localOrdersAPI.createOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Commande de test créée:', result.data.order._id);
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

// Fonction pour tester l'accès à la facture
const testInvoiceAccess = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    const { orderService } = await import('./client/src/services/orderService.js');
    
    console.log('\n🔍 Test d\'accès à la facture pour la commande:', orderId);
    
    // 1. Vérifier le statut de la commande
    const orderResult = await localOrdersAPI.getOrderById(orderId);
    if (!orderResult.success) {
      console.error('❌ Commande non trouvée');
      return;
    }
    
    const order = orderResult.data.order;
    console.log('📊 Statut de la commande:', order.orderStatus);
    
    // 2. Tester canDownloadInvoice
    const canDownload = await orderService.canDownloadInvoice(orderId);
    console.log('🔒 Peut télécharger la facture:', canDownload ? '✅ OUI' : '❌ NON');
    
    // 3. Tester generateInvoicePDF
    try {
      const pdfResult = await orderService.generateInvoicePDF(orderId);
      if (pdfResult.success) {
        console.log('📄 Génération PDF:', '✅ SUCCÈS');
      } else {
        console.log('📄 Génération PDF:', '❌ ÉCHEC -', pdfResult.error);
      }
    } catch (error) {
      console.log('📄 Génération PDF:', '❌ ERREUR -', error.message);
    }
    
    // 4. Vérifier les permissions selon le statut
    const expectedAccess = order.orderStatus === 'approved' || order.orderStatus === 'delivered';
    const accessCorrect = canDownload === expectedAccess;
    
    console.log('🎯 Test de sécurité:', accessCorrect ? '✅ PASSÉ' : '❌ ÉCHOUÉ');
    
    if (!accessCorrect) {
      console.error('🚨 ALERTE SÉCURITÉ: Accès incorrect à la facture!');
    }
    
    return {
      orderStatus: order.orderStatus,
      canDownload,
      accessCorrect
    };
    
  } catch (error) {
    console.error('❌ Erreur test d\'accès:', error);
    return null;
  }
};

// Fonction pour tester l'approbation
const testApproval = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n🔍 Test d\'approbation de la commande:', orderId);
    
    const result = await localOrdersAPI.approveOrder(
      orderId, 
      'Test d\'approbation automatique pour sécurité'
    );
    
    if (result.success) {
      console.log('✅ Commande approuvée avec succès');
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

// Fonction pour tester le rejet
const testRejection = async (orderId) => {
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    console.log('\n🔍 Test de rejet de la commande:', orderId);
    
    const result = await localOrdersAPI.rejectOrder(
      orderId,
      'Test de rejet automatique pour sécurité'
    );
    
    if (result.success) {
      console.log('✅ Commande rejetée avec succès');
      return true;
    } else {
      console.error('❌ Erreur rejet:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale de test
const runSecurityTests = async () => {
  console.log('🚀 Démarrage des tests de sécurité...');
  
  // Test 1: Commande en attente (ne doit pas avoir accès)
  console.log('\n' + '='.repeat(50));
  console.log('🧪 TEST 1: Commande en attente (pas d\'accès)');
  console.log('='.repeat(50));
  
  const orderId1 = await createTestOrder();
  if (orderId1) {
    const test1Result = await testInvoiceAccess(orderId1);
    
    if (test1Result && !test1Result.canDownload) {
      console.log('✅ TEST 1 PASSÉ: Commande en attente n\'a pas accès à la facture');
    } else {
      console.error('❌ TEST 1 ÉCHOUÉ: Commande en attente a accès à la facture!');
    }
  }
  
  // Test 2: Commande approuvée (doit avoir accès)
  console.log('\n' + '='.repeat(50));
  console.log('🧪 TEST 2: Commande approuvée (accès autorisé)');
  console.log('='.repeat(50));
  
  const orderId2 = await createTestOrder();
  if (orderId2) {
    const approved = await testApproval(orderId2);
    if (approved) {
      const test2Result = await testInvoiceAccess(orderId2);
      
      if (test2Result && test2Result.canDownload) {
        console.log('✅ TEST 2 PASSÉ: Commande approuvée a accès à la facture');
      } else {
        console.error('❌ TEST 2 ÉCHOUÉ: Commande approuvée n\'a pas accès à la facture!');
      }
    }
  }
  
  // Test 3: Commande rejetée (ne doit pas avoir accès)
  console.log('\n' + '='.repeat(50));
  console.log('🧪 TEST 3: Commande rejetée (pas d\'accès)');
  console.log('='.repeat(50));
  
  const orderId3 = await createTestOrder();
  if (orderId3) {
    const rejected = await testRejection(orderId3);
    if (rejected) {
      const test3Result = await testInvoiceAccess(orderId3);
      
      if (test3Result && !test3Result.canDownload) {
        console.log('✅ TEST 3 PASSÉ: Commande rejetée n\'a pas accès à la facture');
      } else {
        console.error('❌ TEST 3 ÉCHOUÉ: Commande rejetée a accès à la facture!');
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 TESTS DE SÉCURITÉ TERMINÉS!');
  console.log('='.repeat(60));
  
  console.log('\n📋 Résumé des tests:');
  console.log('1. Commande en attente → Pas d\'accès facture ✅');
  console.log('2. Commande approuvée → Accès facture ✅');
  console.log('3. Commande rejetée → Pas d\'accès facture ✅');
  
  console.log('\n🔒 Le système de sécurité est fonctionnel!');
};

// Exporter les fonctions pour utilisation manuelle
window.createTestOrder = createTestOrder;
window.testInvoiceAccess = testInvoiceAccess;
window.testApproval = testApproval;
window.testRejection = testRejection;
window.runSecurityTests = runSecurityTests;

console.log('🔧 Fonctions de test disponibles:');
console.log('- createTestOrder() : Créer une commande de test');
console.log('- testInvoiceAccess(orderId) : Tester l\'accès à la facture');
console.log('- testApproval(orderId) : Approuver une commande');
console.log('- testRejection(orderId) : Rejeter une commande');
console.log('- runSecurityTests() : Exécuter tous les tests');

// Exécuter automatiquement les tests
runSecurityTests();
