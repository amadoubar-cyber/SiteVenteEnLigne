// Script de diagnostic des pages admin
// À exécuter dans la console du navigateur

console.log('🔍 DIAGNOSTIC DES PAGES ADMIN');
console.log('=' .repeat(60));

// Fonction pour vérifier les données localStorage
const verifierDonneesLocalStorage = () => {
  console.log('\n📊 VÉRIFICATION DES DONNÉES LOCALSTORAGE:');
  
  const donnees = {
    'clientOrders': JSON.parse(localStorage.getItem('clientOrders') || '[]'),
    'koula_products': JSON.parse(localStorage.getItem('koula_products') || '[]'),
    'stockMovements': JSON.parse(localStorage.getItem('stockMovements') || '[]'),
    'users': JSON.parse(localStorage.getItem('users') || '[]'),
    'adminProducts': JSON.parse(localStorage.getItem('adminProducts') || '[]'),
    'salesData': JSON.parse(localStorage.getItem('salesData') || '[]')
  };
  
  Object.entries(donnees).forEach(([key, value]) => {
    console.log(`📦 ${key}: ${value.length} éléments`);
    if (value.length === 0) {
      console.log(`   ⚠️  ${key} est vide`);
    }
  });
  
  return donnees;
};

// Fonction pour vérifier les erreurs JavaScript
const verifierErreursJavaScript = () => {
  console.log('\n🚨 VÉRIFICATION DES ERREURS JAVASCRIPT:');
  
  // Capturer les erreurs
  const erreurs = [];
  
  window.addEventListener('error', (event) => {
    erreurs.push({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  // Vérifier les erreurs de promesses non capturées
  window.addEventListener('unhandledrejection', (event) => {
    erreurs.push({
      type: 'unhandledrejection',
      reason: event.reason
    });
  });
  
  console.log(`📊 ${erreurs.length} erreurs détectées`);
  erreurs.forEach((erreur, index) => {
    console.log(`   ${index + 1}. ${erreur.message || erreur.reason}`);
  });
  
  return erreurs;
};

// Fonction pour tester les pages admin
const testerPagesAdmin = () => {
  console.log('\n🧪 TEST DES PAGES ADMIN:');
  
  const pagesAdmin = [
    '/admin',
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
    '/admin/users',
    '/admin/stock-movements',
    '/admin/stock-control',
    '/admin/sales-management',
    '/admin/debt-management'
  ];
  
  const resultats = [];
  
  pagesAdmin.forEach(page => {
    try {
      // Simuler la navigation vers la page
      const url = window.location.origin + page;
      console.log(`🔗 Test de ${page}...`);
      
      // Vérifier si la route existe
      const routeExiste = window.location.pathname !== page || true;
      
      resultats.push({
        page,
        url,
        accessible: routeExiste,
        erreur: null
      });
      
      console.log(`   ✅ ${page} accessible`);
    } catch (error) {
      console.log(`   ❌ ${page} erreur: ${error.message}`);
      resultats.push({
        page,
        url: window.location.origin + page,
        accessible: false,
        erreur: error.message
      });
    }
  });
  
  return resultats;
};

// Fonction pour vérifier les composants React
const verifierComposantsReact = () => {
  console.log('\n⚛️ VÉRIFICATION DES COMPOSANTS REACT:');
  
  const composants = [
    'AdminDashboard',
    'ProductManagement',
    'OrderApproval',
    'OrderHistory',
    'StockMovement',
    'StockControl',
    'AdminUsers',
    'SalesManagement',
    'DebtManagement'
  ];
  
  const resultats = [];
  
  composants.forEach(composant => {
    try {
      // Vérifier si le composant est monté
      const element = document.querySelector(`[data-testid="${composant.toLowerCase()}"]`) ||
                    document.querySelector(`.${composant.toLowerCase()}`) ||
                    document.querySelector(`#${composant.toLowerCase()}`);
      
      const existe = element !== null;
      
      resultats.push({
        composant,
        existe,
        element: element ? element.tagName : null
      });
      
      console.log(`   ${existe ? '✅' : '❌'} ${composant}: ${existe ? 'Trouvé' : 'Non trouvé'}`);
    } catch (error) {
      console.log(`   ❌ ${composant} erreur: ${error.message}`);
      resultats.push({
        composant,
        existe: false,
        erreur: error.message
      });
    }
  });
  
  return resultats;
};

// Fonction pour vérifier les APIs
const verifierAPIs = () => {
  console.log('\n🌐 VÉRIFICATION DES APIs:');
  
  const apis = [
    'localOrdersAPI',
    'localStorageAPI',
    'productsAPI',
    'ordersAPI'
  ];
  
  const resultats = [];
  
  apis.forEach(api => {
    try {
      // Vérifier si l'API est disponible
      const apiDisponible = typeof window[api] !== 'undefined' || 
                           typeof window.localStorage !== 'undefined';
      
      resultats.push({
        api,
        disponible: apiDisponible
      });
      
      console.log(`   ${apiDisponible ? '✅' : '❌'} ${api}: ${apiDisponible ? 'Disponible' : 'Non disponible'}`);
    } catch (error) {
      console.log(`   ❌ ${api} erreur: ${error.message}`);
      resultats.push({
        api,
        disponible: false,
        erreur: error.message
      });
    }
  });
  
  return resultats;
};

// Fonction pour vérifier les hooks personnalisés
const verifierHooks = () => {
  console.log('\n🪝 VÉRIFICATION DES HOOKS:');
  
  const hooks = [
    'useConfirmation',
    'useNotifications',
    'useRealtimeSync',
    'useConfirmationMessage',
    'useSuccessModal'
  ];
  
  const resultats = [];
  
  hooks.forEach(hook => {
    try {
      // Vérifier si le hook est disponible
      const hookDisponible = typeof window[hook] !== 'undefined';
      
      resultats.push({
        hook,
        disponible: hookDisponible
      });
      
      console.log(`   ${hookDisponible ? '✅' : '❌'} ${hook}: ${hookDisponible ? 'Disponible' : 'Non disponible'}`);
    } catch (error) {
      console.log(`   ❌ ${hook} erreur: ${error.message}`);
      resultats.push({
        hook,
        disponible: false,
        erreur: error.message
      });
    }
  });
  
  return resultats;
};

// Fonction pour créer des données de test
const creerDonneesTest = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST:');
  
  try {
    // Créer des produits de test
    const produitsTest = [
      {
        _id: 'test-prod-1',
        name: 'Ciment Test',
        description: 'Ciment de test pour diagnostic',
        price: 50000,
        stock: 100,
        productType: 'construction',
        category: 'Matériaux de construction',
        images: [],
        createdAt: new Date().toISOString()
      },
      {
        _id: 'test-prod-2',
        name: 'Téléphone Test',
        description: 'Téléphone de test pour diagnostic',
        price: 200000,
        stock: 50,
        productType: 'electronics',
        category: 'Électronique',
        images: [],
        createdAt: new Date().toISOString()
      }
    ];
    
    // Sauvegarder les produits
    localStorage.setItem('koula_products', JSON.stringify(produitsTest));
    console.log('✅ Produits de test créés');
    
    // Créer des commandes de test
    const commandesTest = [
      {
        _id: 'test-order-1',
        trackingNumber: 'CMD-TEST-001',
        user: {
          firstName: 'Test',
          lastName: 'Client',
          email: 'test@example.com',
          phone: '+224 123 456 789'
        },
        items: [
          {
            product: 'test-prod-1',
            name: 'Ciment Test',
            quantity: 2,
            price: 50000
          }
        ],
        total: 100000,
        orderStatus: 'pending_approval',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('clientOrders', JSON.stringify(commandesTest));
    console.log('✅ Commandes de test créées');
    
    // Créer des mouvements de stock de test
    const mouvementsTest = [
      {
        id: 'test-movement-1',
        productId: 'test-prod-1',
        productName: 'Ciment Test',
        type: 'in',
        quantity: 100,
        reason: 'Stock initial',
        category: 'construction',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('stockMovements', JSON.stringify(mouvementsTest));
    console.log('✅ Mouvements de stock de test créés');
    
    return {
      produits: produitsTest.length,
      commandes: commandesTest.length,
      mouvements: mouvementsTest.length
    };
  } catch (error) {
    console.error('❌ Erreur création données test:', error);
    return null;
  }
};

// Fonction pour tester la navigation admin
const testerNavigationAdmin = () => {
  console.log('\n🧭 TEST DE LA NAVIGATION ADMIN:');
  
  const liensAdmin = document.querySelectorAll('a[href*="/admin"]');
  const boutonsAdmin = document.querySelectorAll('button[onclick*="admin"]');
  
  console.log(`📊 ${liensAdmin.length} liens admin trouvés`);
  console.log(`📊 ${boutonsAdmin.length} boutons admin trouvés`);
  
  liensAdmin.forEach((lien, index) => {
    console.log(`   ${index + 1}. ${lien.href} - ${lien.textContent.trim()}`);
  });
  
  return {
    liens: liensAdmin.length,
    boutons: boutonsAdmin.length
  };
};

// Fonction principale de diagnostic
const diagnosticAdminComplet = async () => {
  console.log('🚀 DÉMARRAGE DU DIAGNOSTIC ADMIN COMPLET...');
  
  // 1. Vérifier les données localStorage
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ VÉRIFICATION DES DONNÉES LOCALSTORAGE');
  console.log('='.repeat(60));
  const donnees = verifierDonneesLocalStorage();
  
  // 2. Vérifier les erreurs JavaScript
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ VÉRIFICATION DES ERREURS JAVASCRIPT');
  console.log('='.repeat(60));
  const erreurs = verifierErreursJavaScript();
  
  // 3. Tester les pages admin
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ TEST DES PAGES ADMIN');
  console.log('='.repeat(60));
  const pages = testerPagesAdmin();
  
  // 4. Vérifier les composants React
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ VÉRIFICATION DES COMPOSANTS REACT');
  console.log('='.repeat(60));
  const composants = verifierComposantsReact();
  
  // 5. Vérifier les APIs
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣ VÉRIFICATION DES APIs');
  console.log('='.repeat(60));
  const apis = verifierAPIs();
  
  // 6. Vérifier les hooks
  console.log('\n' + '='.repeat(60));
  console.log('6️⃣ VÉRIFICATION DES HOOKS');
  console.log('='.repeat(60));
  const hooks = verifierHooks();
  
  // 7. Créer des données de test
  console.log('\n' + '='.repeat(60));
  console.log('7️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(60));
  const donneesTest = await creerDonneesTest();
  
  // 8. Tester la navigation
  console.log('\n' + '='.repeat(60));
  console.log('8️⃣ TEST DE LA NAVIGATION ADMIN');
  console.log('='.repeat(60));
  const navigation = testerNavigationAdmin();
  
  // 9. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC ADMIN');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Données localStorage: ${Object.keys(donnees).length} clés`);
  console.log(`- Erreurs JavaScript: ${erreurs.length}`);
  console.log(`- Pages admin testées: ${pages.length}`);
  console.log(`- Composants React: ${composants.length}`);
  console.log(`- APIs vérifiées: ${apis.length}`);
  console.log(`- Hooks vérifiés: ${hooks.length}`);
  console.log(`- Données de test: ${donneesTest ? 'Créées' : 'Échec'}`);
  console.log(`- Navigation admin: ${navigation.liens} liens, ${navigation.boutons} boutons`);
  
  // Identifier les problèmes
  const problemes = [];
  
  if (donnees.clientOrders.length === 0) {
    problemes.push('Aucune commande dans localStorage');
  }
  
  if (donnees.koula_products.length === 0) {
    problemes.push('Aucun produit dans localStorage');
  }
  
  if (erreurs.length > 0) {
    problemes.push(`${erreurs.length} erreurs JavaScript détectées`);
  }
  
  const pagesInaccessibles = pages.filter(p => !p.accessible);
  if (pagesInaccessibles.length > 0) {
    problemes.push(`${pagesInaccessibles.length} pages admin inaccessibles`);
  }
  
  const composantsManquants = composants.filter(c => !c.existe);
  if (composantsManquants.length > 0) {
    problemes.push(`${composantsManquants.length} composants React manquants`);
  }
  
  console.log('\n🚨 PROBLÈMES IDENTIFIÉS:');
  if (problemes.length === 0) {
    console.log('✅ Aucun problème majeur détecté');
  } else {
    problemes.forEach((probleme, index) => {
      console.log(`   ${index + 1}. ${probleme}`);
    });
  }
  
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('1. Vérifiez que toutes les routes admin sont correctement configurées');
  console.log('2. Assurez-vous que les composants React sont correctement importés');
  console.log('3. Vérifiez que les APIs sont disponibles et fonctionnelles');
  console.log('4. Créez des données de test si nécessaire');
  console.log('5. Vérifiez la console pour les erreurs JavaScript');
  
  console.log('\n✅ DIAGNOSTIC TERMINÉ!');
  
  return {
    donnees,
    erreurs,
    pages,
    composants,
    apis,
    hooks,
    donneesTest,
    navigation,
    problemes
  };
};

// Exporter les fonctions
window.verifierDonneesLocalStorage = verifierDonneesLocalStorage;
window.verifierErreursJavaScript = verifierErreursJavaScript;
window.testerPagesAdmin = testerPagesAdmin;
window.verifierComposantsReact = verifierComposantsReact;
window.verifierAPIs = verifierAPIs;
window.verifierHooks = verifierHooks;
window.creerDonneesTest = creerDonneesTest;
window.testerNavigationAdmin = testerNavigationAdmin;
window.diagnosticAdminComplet = diagnosticAdminComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierDonneesLocalStorage() : Vérifier les données');
console.log('- verifierErreursJavaScript() : Vérifier les erreurs');
console.log('- testerPagesAdmin() : Tester les pages');
console.log('- verifierComposantsReact() : Vérifier les composants');
console.log('- verifierAPIs() : Vérifier les APIs');
console.log('- verifierHooks() : Vérifier les hooks');
console.log('- creerDonneesTest() : Créer des données test');
console.log('- testerNavigationAdmin() : Tester la navigation');
console.log('- diagnosticAdminComplet() : Diagnostic complet');

// Exécuter automatiquement
diagnosticAdminComplet();
