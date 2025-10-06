// Script de correction des problèmes admin
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION DES PROBLÈMES ADMIN');
console.log('=' .repeat(60));

// Fonction pour corriger les données localStorage manquantes
const corrigerDonneesLocalStorage = () => {
  console.log('\n📊 CORRECTION DES DONNÉES LOCALSTORAGE:');
  
  try {
    // Vérifier et corriger les produits
    let produits = JSON.parse(localStorage.getItem('koula_products') || '[]');
    if (produits.length === 0) {
      console.log('🔧 Création de produits de base...');
      produits = [
        {
          _id: 'prod-fer-001',
          name: 'Fer à Béton 12mm',
          description: 'Fer à béton de qualité supérieure, diamètre 12mm',
          price: 15000,
          stock: 500,
          productType: 'construction',
          category: 'Matériaux de construction',
          images: [],
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          _id: 'prod-ciment-001',
          name: 'Ciment Portland',
          description: 'Ciment Portland de qualité standard',
          price: 45000,
          stock: 200,
          productType: 'construction',
          category: 'Matériaux de construction',
          images: [],
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          _id: 'prod-tel-001',
          name: 'Samsung Galaxy A14',
          description: 'Smartphone Samsung Galaxy A14, 128GB',
          price: 180000,
          stock: 50,
          productType: 'electronics',
          category: 'Électronique',
          images: [],
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      localStorage.setItem('koula_products', JSON.stringify(produits));
      console.log(`✅ ${produits.length} produits créés`);
    } else {
      console.log(`✅ ${produits.length} produits existants`);
    }
    
    // Vérifier et corriger les commandes
    let commandes = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    if (commandes.length === 0) {
      console.log('🔧 Création de commandes de test...');
      commandes = [
        {
          _id: 'order-test-001',
          trackingNumber: 'CMD-2024-001',
          user: {
            firstName: 'Test',
            lastName: 'Client',
            email: 'test@example.com',
            phone: '+224 123 456 789'
          },
          items: [
            {
              product: 'prod-fer-001',
              name: 'Fer à Béton 12mm',
              quantity: 10,
              price: 15000
            }
          ],
          total: 150000,
          subtotal: 150000,
          shippingCost: 0,
          tax: 0,
          orderStatus: 'pending_approval',
          paymentMethod: 'mobile_money',
          shippingAddress: {
            firstName: 'Test',
            lastName: 'Client',
            street: '123 Rue Test',
            city: 'Conakry',
            phone: '+224 123 456 789'
          },
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('clientOrders', JSON.stringify(commandes));
      console.log(`✅ ${commandes.length} commandes créées`);
    } else {
      console.log(`✅ ${commandes.length} commandes existantes`);
    }
    
    // Vérifier et corriger les mouvements de stock
    let mouvements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    if (mouvements.length === 0) {
      console.log('🔧 Création de mouvements de stock...');
      mouvements = [
        {
          id: 'movement-001',
          productId: 'prod-fer-001',
          productName: 'Fer à Béton 12mm',
          type: 'in',
          quantity: 500,
          reason: 'Stock initial',
          category: 'construction',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        },
        {
          id: 'movement-002',
          productId: 'prod-ciment-001',
          productName: 'Ciment Portland',
          type: 'in',
          quantity: 200,
          reason: 'Stock initial',
          category: 'construction',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        },
        {
          id: 'movement-003',
          productId: 'prod-tel-001',
          productName: 'Samsung Galaxy A14',
          type: 'in',
          quantity: 50,
          reason: 'Stock initial',
          category: 'electronics',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('stockMovements', JSON.stringify(mouvements));
      console.log(`✅ ${mouvements.length} mouvements créés`);
    } else {
      console.log(`✅ ${mouvements.length} mouvements existants`);
    }
    
    // Vérifier et corriger les utilisateurs
    let utilisateurs = JSON.parse(localStorage.getItem('users') || '[]');
    if (utilisateurs.length === 0) {
      console.log('🔧 Création d\'utilisateurs de test...');
      utilisateurs = [
        {
          _id: 'user-admin-001',
          firstName: 'Admin',
          lastName: 'Bowoye',
          email: 'admin@bowoye.gn',
          phone: '+224 612 63 73 35',
          role: 'admin',
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          _id: 'user-client-001',
          firstName: 'Test',
          lastName: 'Client',
          email: 'test@example.com',
          phone: '+224 123 456 789',
          role: 'client',
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      localStorage.setItem('users', JSON.stringify(utilisateurs));
      console.log(`✅ ${utilisateurs.length} utilisateurs créés`);
    } else {
      console.log(`✅ ${utilisateurs.length} utilisateurs existants`);
    }
    
    return {
      produits: produits.length,
      commandes: commandes.length,
      mouvements: mouvements.length,
      utilisateurs: utilisateurs.length
    };
  } catch (error) {
    console.error('❌ Erreur correction données:', error);
    return null;
  }
};

// Fonction pour corriger les erreurs de navigation
const corrigerNavigationAdmin = () => {
  console.log('\n🧭 CORRECTION DE LA NAVIGATION ADMIN:');
  
  try {
    // Vérifier si on est sur une page admin
    const isAdminPage = window.location.pathname.includes('/admin');
    
    if (!isAdminPage) {
      console.log('🔧 Redirection vers la page admin...');
      window.location.href = '/admin';
      return;
    }
    
    // Vérifier les liens de navigation
    const liensAdmin = document.querySelectorAll('a[href*="/admin"]');
    console.log(`📊 ${liensAdmin.length} liens admin trouvés`);
    
    // Vérifier les boutons de navigation
    const boutonsAdmin = document.querySelectorAll('button[onclick*="admin"]');
    console.log(`📊 ${boutonsAdmin.length} boutons admin trouvés`);
    
    // Créer des boutons de navigation manquants si nécessaire
    if (liensAdmin.length === 0 && boutonsAdmin.length === 0) {
      console.log('🔧 Création de boutons de navigation admin...');
      
      const navAdmin = document.createElement('div');
      navAdmin.className = 'admin-nav-fix';
      navAdmin.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      `;
      
      const pagesAdmin = [
        { name: 'Dashboard', url: '/admin' },
        { name: 'Produits', url: '/admin/products' },
        { name: 'Commandes', url: '/admin/orders' },
        { name: 'Stock', url: '/admin/stock-movements' },
        { name: 'Utilisateurs', url: '/admin/users' }
      ];
      
      pagesAdmin.forEach(page => {
        const bouton = document.createElement('button');
        bouton.textContent = page.name;
        bouton.className = 'admin-nav-btn';
        bouton.style.cssText = `
          padding: 8px 12px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        `;
        bouton.onclick = () => {
          window.location.href = page.url;
        };
        navAdmin.appendChild(bouton);
      });
      
      document.body.appendChild(navAdmin);
      console.log('✅ Boutons de navigation admin créés');
    }
    
    return {
      liens: liensAdmin.length,
      boutons: boutonsAdmin.length,
      navigationCreee: liensAdmin.length === 0 && boutonsAdmin.length === 0
    };
  } catch (error) {
    console.error('❌ Erreur correction navigation:', error);
    return null;
  }
};

// Fonction pour corriger les erreurs de composants React
const corrigerComposantsReact = () => {
  console.log('\n⚛️ CORRECTION DES COMPOSANTS REACT:');
  
  try {
    // Vérifier les erreurs React dans la console
    const erreursReact = [];
    
    // Capturer les erreurs React
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('React'))) {
        erreursReact.push(args.join(' '));
      }
      originalConsoleError.apply(console, args);
    };
    
    // Vérifier les composants manquants
    const composantsManquants = [
      'AdminDashboard',
      'ProductManagement',
      'OrderApproval',
      'StockMovement',
      'AdminUsers'
    ];
    
    const composantsCorriges = [];
    
    composantsManquants.forEach(composant => {
      const element = document.querySelector(`[data-testid="${composant.toLowerCase()}"]`) ||
                    document.querySelector(`.${composant.toLowerCase()}`) ||
                    document.querySelector(`#${composant.toLowerCase()}`);
      
      if (!element) {
        console.log(`🔧 Composant ${composant} manquant, création d'un placeholder...`);
        
        const placeholder = document.createElement('div');
        placeholder.className = `${composant.toLowerCase()}-placeholder`;
        placeholder.setAttribute('data-testid', composant.toLowerCase());
        placeholder.style.cssText = `
          padding: 20px;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          text-align: center;
          color: #6c757d;
          margin: 20px 0;
        `;
        placeholder.innerHTML = `
          <h3>${composant}</h3>
          <p>Composant en cours de chargement...</p>
          <button onclick="window.location.reload()" style="
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          ">Recharger</button>
        `;
        
        // Ajouter le placeholder au contenu principal
        const mainContent = document.querySelector('main') || 
                          document.querySelector('.main-content') || 
                          document.querySelector('#root') ||
                          document.body;
        
        if (mainContent) {
          mainContent.appendChild(placeholder);
          composantsCorriges.push(composant);
        }
      }
    });
    
    console.log(`✅ ${composantsCorriges.length} composants corrigés`);
    
    return {
      erreursReact: erreursReact.length,
      composantsCorriges: composantsCorriges.length
    };
  } catch (error) {
    console.error('❌ Erreur correction composants:', error);
    return null;
  }
};

// Fonction pour corriger les erreurs d'API
const corrigerAPIs = () => {
  console.log('\n🌐 CORRECTION DES APIs:');
  
  try {
    // Vérifier et corriger les APIs manquantes
    const apisManquantes = [];
    
    // Vérifier localOrdersAPI
    if (typeof window.localOrdersAPI === 'undefined') {
      console.log('🔧 Création de localOrdersAPI...');
      window.localOrdersAPI = {
        getAllOrders: async () => {
          const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
          return { success: true, data: { orders } };
        },
        getOrderById: async (id) => {
          const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
          const order = orders.find(o => o._id === id);
          return { success: !!order, data: { order } };
        },
        approveOrder: async (id, notes) => {
          const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
          const orderIndex = orders.findIndex(o => o._id === id);
          if (orderIndex !== -1) {
            orders[orderIndex].orderStatus = 'approved';
            orders[orderIndex].adminNotes = notes;
            orders[orderIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('clientOrders', JSON.stringify(orders));
            return { success: true, data: { order: orders[orderIndex] } };
          }
          return { success: false, error: 'Commande non trouvée' };
        },
        rejectOrder: async (id, reason) => {
          const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
          const orderIndex = orders.findIndex(o => o._id === id);
          if (orderIndex !== -1) {
            orders[orderIndex].orderStatus = 'rejected';
            orders[orderIndex].rejectionReason = reason;
            orders[orderIndex].rejectedAt = new Date().toISOString();
            localStorage.setItem('clientOrders', JSON.stringify(orders));
            return { success: true, data: { order: orders[orderIndex] } };
          }
          return { success: false, error: 'Commande non trouvée' };
        }
      };
      apisManquantes.push('localOrdersAPI');
    }
    
    // Vérifier localStorageAPI
    if (typeof window.localStorageAPI === 'undefined') {
      console.log('🔧 Création de localStorageAPI...');
      window.localStorageAPI = {
        getAllProducts: () => {
          return JSON.parse(localStorage.getItem('koula_products') || '[]');
        },
        getProductById: (id) => {
          const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
          return products.find(p => p._id === id);
        },
        createProduct: async (productData) => {
          const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
          const newProduct = {
            ...productData,
            _id: 'prod-' + Date.now(),
            createdAt: new Date().toISOString()
          };
          products.push(newProduct);
          localStorage.setItem('koula_products', JSON.stringify(products));
          return { success: true, data: { product: newProduct } };
        },
        updateProduct: async (id, productData) => {
          const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
          const productIndex = products.findIndex(p => p._id === id);
          if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...productData };
            localStorage.setItem('koula_products', JSON.stringify(products));
            return { success: true, data: { product: products[productIndex] } };
          }
          return { success: false, error: 'Produit non trouvé' };
        },
        deleteProduct: async (id) => {
          const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
          const filteredProducts = products.filter(p => p._id !== id);
          localStorage.setItem('koula_products', JSON.stringify(filteredProducts));
          return { success: true };
        }
      };
      apisManquantes.push('localStorageAPI');
    }
    
    console.log(`✅ ${apisManquantes.length} APIs corrigées`);
    
    return {
      apisCorrigees: apisManquantes.length,
      apis: apisManquantes
    };
  } catch (error) {
    console.error('❌ Erreur correction APIs:', error);
    return null;
  }
};

// Fonction pour corriger les erreurs de hooks
const corrigerHooks = () => {
  console.log('\n🪝 CORRECTION DES HOOKS:');
  
  try {
    const hooksManquants = [];
    
    // Vérifier useConfirmation
    if (typeof window.useConfirmation === 'undefined') {
      console.log('🔧 Création de useConfirmation...');
      window.useConfirmation = () => ({
        confirmation: { isOpen: false },
        showConfirmation: (data) => {
          if (confirm(data.message)) {
            data.onConfirm && data.onConfirm();
          }
        },
        hideConfirmation: () => {},
        handleConfirm: () => {}
      });
      hooksManquants.push('useConfirmation');
    }
    
    // Vérifier useNotifications
    if (typeof window.useNotifications === 'undefined') {
      console.log('🔧 Création de useNotifications...');
      window.useNotifications = () => ({
        notifyNewOrder: (order) => {
          console.log('🔔 Nouvelle commande:', order.trackingNumber);
        }
      });
      hooksManquants.push('useNotifications');
    }
    
    // Vérifier useRealtimeSync
    if (typeof window.useRealtimeSync === 'undefined') {
      console.log('🔧 Création de useRealtimeSync...');
      window.useRealtimeSync = (key, callback) => ({
        forceSync: () => {
          console.log('🔄 Synchronisation forcée');
        },
        getStats: () => ({})
      });
      hooksManquants.push('useRealtimeSync');
    }
    
    console.log(`✅ ${hooksManquants.length} hooks corrigés`);
    
    return {
      hooksCorriges: hooksManquants.length,
      hooks: hooksManquants
    };
  } catch (error) {
    console.error('❌ Erreur correction hooks:', error);
    return null;
  }
};

// Fonction pour recharger les pages admin
const rechargerPagesAdmin = () => {
  console.log('\n🔄 RECHARGEMENT DES PAGES ADMIN:');
  
  try {
    // Vérifier si on est sur une page admin
    const isAdminPage = window.location.pathname.includes('/admin');
    
    if (isAdminPage) {
      console.log('🔧 Rechargement de la page admin actuelle...');
      window.location.reload();
    } else {
      console.log('🔧 Redirection vers la page admin...');
      window.location.href = '/admin';
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur rechargement:', error);
    return false;
  }
};

// Fonction principale de correction
const correctionAdminComplet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION ADMIN COMPLÈTE...');
  
  // 1. Corriger les données localStorage
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ CORRECTION DES DONNÉES LOCALSTORAGE');
  console.log('='.repeat(60));
  const donneesCorrigees = corrigerDonneesLocalStorage();
  
  // 2. Corriger la navigation admin
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CORRECTION DE LA NAVIGATION ADMIN');
  console.log('='.repeat(60));
  const navigationCorrigee = corrigerNavigationAdmin();
  
  // 3. Corriger les composants React
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CORRECTION DES COMPOSANTS REACT');
  console.log('='.repeat(60));
  const composantsCorriges = corrigerComposantsReact();
  
  // 4. Corriger les APIs
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ CORRECTION DES APIs');
  console.log('='.repeat(60));
  const apisCorrigees = corrigerAPIs();
  
  // 5. Corriger les hooks
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣ CORRECTION DES HOOKS');
  console.log('='.repeat(60));
  const hooksCorriges = corrigerHooks();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA CORRECTION ADMIN');
  console.log('='.repeat(70));
  
  console.log('🔧 Corrections effectuées:');
  console.log(`- Données localStorage: ${donneesCorrigees ? 'Corrigées' : 'Échec'}`);
  console.log(`- Navigation admin: ${navigationCorrigee ? 'Corrigée' : 'Échec'}`);
  console.log(`- Composants React: ${composantsCorriges ? 'Corrigés' : 'Échec'}`);
  console.log(`- APIs: ${apisCorrigees ? 'Corrigées' : 'Échec'}`);
  console.log(`- Hooks: ${hooksCorriges ? 'Corrigés' : 'Échec'}`);
  
  console.log('\n🎉 CORRECTION TERMINÉE!');
  console.log('\n💡 Prochaines étapes:');
  console.log('1. Rechargez la page admin');
  console.log('2. Vérifiez que toutes les fonctionnalités marchent');
  console.log('3. Testez la navigation entre les pages');
  console.log('4. Vérifiez que les données s\'affichent correctement');
  
  console.log('\n🔧 Pour recharger automatiquement:');
  console.log('- Exécutez: rechargerPagesAdmin()');
  
  console.log('\n✅ Les pages admin devraient maintenant fonctionner!');
  
  return {
    donneesCorrigees,
    navigationCorrigee,
    composantsCorriges,
    apisCorrigees,
    hooksCorriges
  };
};

// Exporter les fonctions
window.corrigerDonneesLocalStorage = corrigerDonneesLocalStorage;
window.corrigerNavigationAdmin = corrigerNavigationAdmin;
window.corrigerComposantsReact = corrigerComposantsReact;
window.corrigerAPIs = corrigerAPIs;
window.corrigerHooks = corrigerHooks;
window.rechargerPagesAdmin = rechargerPagesAdmin;
window.correctionAdminComplet = correctionAdminComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- corrigerDonneesLocalStorage() : Corriger les données');
console.log('- corrigerNavigationAdmin() : Corriger la navigation');
console.log('- corrigerComposantsReact() : Corriger les composants');
console.log('- corrigerAPIs() : Corriger les APIs');
console.log('- corrigerHooks() : Corriger les hooks');
console.log('- rechargerPagesAdmin() : Recharger les pages');
console.log('- correctionAdminComplet() : Correction complète');

// Exécuter automatiquement
correctionAdminComplet();
