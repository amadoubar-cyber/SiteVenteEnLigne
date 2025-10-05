// Script de diagnostic pour le problème de déconnexion lors de la confirmation de commande
// À exécuter dans la console du navigateur

console.log('🔍 DIAGNOSTIC - PROBLÈME DE DÉCONNEXION LORS DE LA COMMANDE');
console.log('=' .repeat(70));

// Fonction pour vérifier l'état de l'authentification
const checkAuthState = () => {
  console.log('\n📊 ÉTAT DE L\'AUTHENTIFICATION:');
  console.log('- Token localStorage:', localStorage.getItem('token') ? '✅ Présent' : '❌ Absent');
  console.log('- User localStorage:', localStorage.getItem('user') ? '✅ Présent' : '❌ Absent');
  
  // Vérifier si l'utilisateur est connecté dans le contexte React
  const authElements = document.querySelectorAll('[data-testid="user-menu"], [data-testid="logout-button"]');
  console.log('- Éléments UI auth:', authElements.length > 0 ? '✅ Présents' : '❌ Absents');
  
  // Vérifier les cookies de session
  console.log('- Cookies:', document.cookie ? '✅ Présents' : '❌ Absents');
  
  return {
    hasToken: !!localStorage.getItem('token'),
    hasUser: !!localStorage.getItem('user'),
    hasAuthUI: authElements.length > 0
  };
};

// Fonction pour simuler une commande et surveiller les changements
const simulateOrderCreation = async () => {
  console.log('\n🧪 SIMULATION DE CRÉATION DE COMMANDE:');
  
  // Vérifier l'état avant
  const beforeState = checkAuthState();
  console.log('📋 État AVANT commande:', beforeState);
  
  try {
    // Importer l'API locale
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const testOrderData = {
      items: [
        {
          product: 'test-product-id',
          quantity: 1,
          price: 100000,
          name: 'Produit Test Diagnostic',
          image: ''
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Diagnostic',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Test de diagnostic - déconnexion',
      subtotal: 100000,
      tax: 0,
      total: 100000
    };
    
    console.log('📦 Création de la commande...');
    const result = await localOrdersAPI.createOrder(testOrderData);
    
    if (result.success) {
      console.log('✅ Commande créée avec succès:', result.data.order._id);
    } else {
      console.error('❌ Erreur création commande:', result.error);
    }
    
    // Attendre un peu pour voir les changements
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier l'état après
    const afterState = checkAuthState();
    console.log('📋 État APRÈS commande:', afterState);
    
    // Comparer les états
    const authLost = beforeState.hasToken && !afterState.hasToken;
    const userLost = beforeState.hasUser && !afterState.hasUser;
    
    if (authLost || userLost) {
      console.error('🚨 PROBLÈME DÉTECTÉ: Déconnexion lors de la commande!');
      console.error('- Token perdu:', authLost);
      console.error('- User perdu:', userLost);
    } else {
      console.log('✅ Aucune déconnexion détectée');
    }
    
    return {
      success: result.success,
      authLost,
      userLost,
      beforeState,
      afterState
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour surveiller les changements de localStorage
const monitorLocalStorage = () => {
  console.log('\n👁️ SURVEILLANCE DU LOCALSTORAGE:');
  
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  
  localStorage.setItem = function(key, value) {
    console.log(`📝 localStorage.setItem: ${key} = ${value?.substring(0, 50)}...`);
    return originalSetItem.apply(this, arguments);
  };
  
  localStorage.removeItem = function(key) {
    console.log(`🗑️ localStorage.removeItem: ${key}`);
    return originalRemoveItem.apply(this, arguments);
  };
  
  console.log('✅ Surveillance activée - surveillez les changements ci-dessous');
};

// Fonction pour vérifier les erreurs dans la console
const checkConsoleErrors = () => {
  console.log('\n🔍 VÉRIFICATION DES ERREURS:');
  
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  // Restaurer après 5 secondes
  setTimeout(() => {
    console.error = originalError;
    console.log('📊 Erreurs capturées:', errors.length);
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }, 5000);
  
  console.log('✅ Surveillance des erreurs activée pour 5 secondes');
};

// Fonction pour tester l'API serveur
const testServerAPI = async () => {
  console.log('\n🌐 TEST DE L\'API SERVEUR:');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Statut réponse:', response.status);
    
    if (response.status === 401) {
      console.error('❌ Token invalide ou expiré');
      return false;
    } else if (response.ok) {
      console.log('✅ API serveur accessible');
      return true;
    } else {
      console.warn('⚠️ Réponse inattendue:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur API serveur:', error.message);
    return false;
  }
};

// Fonction principale de diagnostic
const runDiagnostic = async () => {
  console.log('🚀 DÉMARRAGE DU DIAGNOSTIC...');
  
  // 1. Vérifier l'état initial
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE L\'ÉTAT INITIAL');
  console.log('='.repeat(50));
  const initialState = checkAuthState();
  
  // 2. Surveiller localStorage
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ SURVEILLANCE DU LOCALSTORAGE');
  console.log('='.repeat(50));
  monitorLocalStorage();
  
  // 3. Surveiller les erreurs
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ SURVEILLANCE DES ERREURS');
  console.log('='.repeat(50));
  checkConsoleErrors();
  
  // 4. Tester l'API serveur
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ TEST DE L\'API SERVEUR');
  console.log('='.repeat(50));
  const serverOk = await testServerAPI();
  
  // 5. Simuler une commande
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ SIMULATION DE COMMANDE');
  console.log('='.repeat(50));
  const orderResult = await simulateOrderCreation();
  
  // 6. Résumé
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log('- État initial:', initialState);
  console.log('- API serveur:', serverOk ? '✅ OK' : '❌ Problème');
  console.log('- Commande:', orderResult.success ? '✅ Créée' : '❌ Échec');
  
  if (orderResult.authLost || orderResult.userLost) {
    console.log('🚨 PROBLÈME CONFIRMÉ: Déconnexion lors de la commande');
    console.log('💡 Solutions possibles:');
    console.log('   1. Vérifier les intercepteurs axios');
    console.log('   2. Vérifier la gestion des erreurs dans Checkout.js');
    console.log('   3. Vérifier AuthContext pour les changements d\'état');
    console.log('   4. Vérifier les appels API qui pourraient échouer');
  } else {
    console.log('✅ Aucun problème de déconnexion détecté');
  }
  
  console.log('\n🔧 Pour résoudre le problème:');
  console.log('1. Vérifiez les logs ci-dessus');
  console.log('2. Surveillez les changements de localStorage');
  console.log('3. Vérifiez les erreurs dans la console');
  console.log('4. Testez avec une vraie commande');
};

// Exporter les fonctions pour utilisation manuelle
window.checkAuthState = checkAuthState;
window.simulateOrderCreation = simulateOrderCreation;
window.monitorLocalStorage = monitorLocalStorage;
window.testServerAPI = testServerAPI;
window.runDiagnostic = runDiagnostic;

console.log('🔧 Fonctions de diagnostic disponibles:');
console.log('- checkAuthState() : Vérifier l\'état de l\'authentification');
console.log('- simulateOrderCreation() : Simuler une commande');
console.log('- monitorLocalStorage() : Surveiller localStorage');
console.log('- testServerAPI() : Tester l\'API serveur');
console.log('- runDiagnostic() : Exécuter le diagnostic complet');

// Exécuter automatiquement le diagnostic
runDiagnostic();
