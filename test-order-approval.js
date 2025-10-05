// Script de test pour vérifier le système de validation des commandes
console.log('🧪 Test du système de validation des commandes...');

// Fonction pour créer une commande de test
const createTestOrder = () => {
  const testOrder = {
    items: [
      {
        product: 'test-product-1',
        quantity: 2,
        price: 50000,
        name: 'Produit Test 1',
        image: ''
      },
      {
        product: 'test-product-2', 
        quantity: 1,
        price: 75000,
        name: 'Produit Test 2',
        image: ''
      }
    ],
    shippingAddress: {
      firstName: 'Test',
      lastName: 'Client',
      street: '123 Rue Test',
      city: 'Conakry',
      phone: '+224 123 456 789'
    },
    paymentMethod: 'mobile_money',
    notes: 'Commande de test pour vérifier le système',
    subtotal: 175000,
    tax: 0,
    total: 175000
  };

  return testOrder;
};

// Fonction pour tester l'approbation
const testOrderApproval = async () => {
  try {
    console.log('📦 Création d\'une commande de test...');
    
    // Importer l'API locale
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    // Créer une commande de test
    const testOrder = createTestOrder();
    const createResult = await localOrdersAPI.createOrder(testOrder);
    
    if (createResult.success) {
      console.log('✅ Commande créée avec succès:', createResult.data.order._id);
      
      // Attendre un peu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tester l'approbation
      console.log('🔍 Test d\'approbation de la commande...');
      const approveResult = await localOrdersAPI.approveOrder(
        createResult.data.order._id, 
        'Commande approuvée par le test automatique'
      );
      
      if (approveResult.success) {
        console.log('✅ Commande approuvée avec succès!');
        console.log('📊 Statut final:', approveResult.data.order.orderStatus);
        console.log('📝 Notes admin:', approveResult.data.order.adminNotes);
        console.log('⏰ Date d\'approbation:', approveResult.data.order.approvedAt);
      } else {
        console.error('❌ Erreur lors de l\'approbation:', approveResult.error);
      }
    } else {
      console.error('❌ Erreur lors de la création:', createResult.error);
    }
  } catch (error) {
    console.error('❌ Erreur dans le test:', error);
  }
};

// Fonction pour tester le rejet
const testOrderRejection = async () => {
  try {
    console.log('📦 Création d\'une commande de test pour rejet...');
    
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrder = createTestOrder();
    const createResult = await localOrdersAPI.createOrder(testOrder);
    
    if (createResult.success) {
      console.log('✅ Commande créée pour test de rejet:', createResult.data.order._id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 Test de rejet de la commande...');
      const rejectResult = await localOrdersAPI.rejectOrder(
        createResult.data.order._id,
        'Commande rejetée par le test automatique - Stock insuffisant'
      );
      
      if (rejectResult.success) {
        console.log('✅ Commande rejetée avec succès!');
        console.log('📊 Statut final:', rejectResult.data.order.orderStatus);
        console.log('📝 Raison du rejet:', rejectResult.data.order.rejectionReason);
        console.log('⏰ Date de rejet:', rejectResult.data.order.rejectedAt);
      } else {
        console.error('❌ Erreur lors du rejet:', rejectResult.error);
      }
    }
  } catch (error) {
    console.error('❌ Erreur dans le test de rejet:', error);
  }
};

// Fonction pour vérifier les notifications
const testNotifications = () => {
  console.log('🔔 Test du système de notifications...');
  
  // Vérifier si les notifications sont stockées
  const notifications = localStorage.getItem('admin_notifications');
  if (notifications) {
    const parsed = JSON.parse(notifications);
    console.log('📱 Notifications trouvées:', parsed.length);
    console.log('📋 Dernières notifications:', parsed.slice(0, 3));
  } else {
    console.log('📱 Aucune notification trouvée');
  }
};

// Fonction pour vérifier les commandes
const checkOrders = () => {
  console.log('📦 Vérification des commandes...');
  
  const orders = localStorage.getItem('clientOrders');
  if (orders) {
    const parsed = JSON.parse(orders);
    console.log('📊 Nombre total de commandes:', parsed.length);
    
    const statusCounts = parsed.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Répartition par statut:', statusCounts);
  } else {
    console.log('📦 Aucune commande trouvée');
  }
};

// Exécuter tous les tests
const runAllTests = async () => {
  console.log('🚀 Démarrage des tests complets...');
  
  // Vérifier l'état initial
  checkOrders();
  testNotifications();
  
  console.log('\n' + '='.repeat(50));
  
  // Test d'approbation
  await testOrderApproval();
  
  console.log('\n' + '='.repeat(50));
  
  // Test de rejet
  await testOrderRejection();
  
  console.log('\n' + '='.repeat(50));
  
  // Vérifier l'état final
  checkOrders();
  testNotifications();
  
  console.log('\n🎉 Tests terminés!');
};

// Exporter les fonctions pour utilisation manuelle
window.testOrderApproval = testOrderApproval;
window.testOrderRejection = testOrderRejection;
window.testNotifications = testNotifications;
window.checkOrders = checkOrders;
window.runAllTests = runAllTests;

console.log('🔧 Fonctions de test disponibles:');
console.log('- testOrderApproval() : Tester l\'approbation');
console.log('- testOrderRejection() : Tester le rejet');
console.log('- testNotifications() : Vérifier les notifications');
console.log('- checkOrders() : Vérifier les commandes');
console.log('- runAllTests() : Exécuter tous les tests');

// Exécuter automatiquement les tests
runAllTests();
