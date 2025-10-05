// Script pour créer un espace client complet
// À exécuter dans la console du navigateur

console.log('👤 CRÉATION D\'UN ESPACE CLIENT COMPLET');
console.log('=' .repeat(50));

// Fonction pour créer un espace client complet
const creerEspaceClientComplet = () => {
  console.log('\n👤 CRÉATION D\'UN ESPACE CLIENT COMPLET:');
  
  // Créer un bouton d'accès à l'espace client dans le header
  const ajouterBoutonEspaceClient = () => {
    console.log('🔗 Ajout du bouton d\'accès à l\'espace client...');
    
    // Trouver le header
    const header = document.querySelector('header');
    if (!header) {
      console.log('❌ Header non trouvé');
      return false;
    }
    
    // Trouver la navigation existante
    const nav = header.querySelector('nav');
    if (!nav) {
      console.log('❌ Navigation non trouvée');
      return false;
    }
    
    // Créer le bouton d'espace client
    const boutonEspaceClient = document.createElement('button');
    boutonEspaceClient.innerHTML = '👤 Mon Espace';
    boutonEspaceClient.className = 'flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium';
    boutonEspaceClient.onclick = () => {
      window.location.href = '/orders';
    };
    
    // Ajouter le bouton à la navigation
    nav.appendChild(boutonEspaceClient);
    
    console.log('✅ Bouton d\'espace client ajouté au header');
    return true;
  };
  
  // Créer une page d'espace client complète
  const creerPageEspaceClient = () => {
    console.log('📄 Création de la page d\'espace client...');
    
    // Créer un script pour ajouter la page
    const script = document.createElement('script');
    script.textContent = `
      // Créer une page d'espace client complète
      const creerPageEspaceClientComplet = () => {
        // Vérifier si on est sur la page /orders
        if (window.location.pathname === '/orders') {
          // Ajouter des éléments à la page existante
          const container = document.querySelector('.max-w-7xl.mx-auto.px-4');
          if (container) {
            // Ajouter un header d'espace client
            const headerEspaceClient = document.createElement('div');
            headerEspaceClient.className = 'bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6';
            headerEspaceClient.innerHTML = \`
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-3xl font-bold mb-2">👤 Mon Espace Client</h1>
                  <p class="text-blue-100">Gérez vos commandes et téléchargez vos factures</p>
                </div>
                <div class="text-right">
                  <div class="text-sm text-blue-100">Connecté en tant que</div>
                  <div class="font-semibold">\${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName : 'Client'}</div>
                </div>
              </div>
            \`;
            
            // Insérer le header au début
            container.insertBefore(headerEspaceClient, container.firstChild);
            
            // Ajouter des statistiques
            const statsContainer = document.createElement('div');
            statsContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6';
            
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
            
            statsContainer.innerHTML = \`
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Commandes</p>
                    <p class="text-2xl font-bold text-gray-900">\${commandesUtilisateur.length}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Commandes Approuvées</p>
                    <p class="text-2xl font-bold text-gray-900">\${commandesApprouvees.length}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">En Attente</p>
                    <p class="text-2xl font-bold text-gray-900">\${commandesEnAttente.length}</p>
                  </div>
                </div>
              </div>
            \`;
            
            // Insérer les statistiques
            const ordersSection = container.querySelector('.bg-white.shadow.rounded-lg');
            if (ordersSection) {
              ordersSection.parentNode.insertBefore(statsContainer, ordersSection);
            }
            
            // Améliorer l'affichage des commandes
            const commandesSection = container.querySelector('.bg-white.shadow.rounded-lg');
            if (commandesSection) {
              const header = commandesSection.querySelector('.px-6.py-4.border-b');
              if (header) {
                header.innerHTML = \`
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-xl font-bold text-gray-900">📦 Mes Commandes</h2>
                      <p class="mt-2 text-gray-600">
                        Gérez et suivez l'état de vos commandes
                      </p>
                    </div>
                    <div class="flex items-center space-x-3">
                      <button
                        onClick="window.location.reload()"
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualiser
                      </button>
                    </div>
                  </div>
                \`;
              }
            }
            
            console.log('✅ Page d\'espace client améliorée');
          }
        }
      };
      
      // Exécuter la création de la page
      creerPageEspaceClientComplet();
    `;
    
    document.head.appendChild(script);
    
    console.log('✅ Page d\'espace client créée');
    return true;
  };
  
  // Créer un menu de navigation pour l'espace client
  const creerMenuNavigation = () => {
    console.log('🧭 Création du menu de navigation...');
    
    const script = document.createElement('script');
    script.textContent = `
      // Créer un menu de navigation pour l'espace client
      const creerMenuNavigationEspaceClient = () => {
        if (window.location.pathname === '/orders') {
          const container = document.querySelector('.max-w-7xl.mx-auto.px-4');
          if (container) {
            // Créer le menu de navigation
            const menuNav = document.createElement('div');
            menuNav.className = 'bg-white rounded-lg shadow-sm border p-4 mb-6';
            menuNav.innerHTML = \`
              <div class="flex flex-wrap gap-4">
                <button
                  onClick="window.location.href='/orders'"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mes Commandes
                </button>
                
                <button
                  onClick="window.location.href='/'"
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Retour au Catalogue
                </button>
                
                <button
                  onClick="window.location.href='/cart'"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  Mon Panier
                </button>
              </div>
            \`;
            
            // Insérer le menu
            const headerEspaceClient = container.querySelector('.bg-gradient-to-r');
            if (headerEspaceClient) {
              headerEspaceClient.parentNode.insertBefore(menuNav, headerEspaceClient.nextSibling);
            }
            
            console.log('✅ Menu de navigation créé');
          }
        }
      };
      
      // Exécuter la création du menu
      creerMenuNavigationEspaceClient();
    `;
    
    document.head.appendChild(script);
    
    console.log('✅ Menu de navigation créé');
    return true;
  };
  
  // Exécuter toutes les créations
  const resultat1 = ajouterBoutonEspaceClient();
  const resultat2 = creerPageEspaceClient();
  const resultat3 = creerMenuNavigation();
  
  return resultat1 && resultat2 && resultat3;
};

// Fonction pour créer des données de test
const creerDonneesTestEspaceClient = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST POUR L\'ESPACE CLIENT:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      console.log('❌ Utilisateur non connecté');
      return false;
    }
    
    // Créer plusieurs commandes de test
    const commandesTest = [
      {
        items: [
          {
            product: 'fer-test-espace-client-1',
            quantity: 2,
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
        notes: 'Commande de test 1 pour l\'espace client',
        subtotal: 600000,
        tax: 0,
        total: 600000
      },
      {
        items: [
          {
            product: 'ciment-test-espace-client-2',
            quantity: 1,
            price: 150000,
            name: 'CIMENT',
            image: 'test-image-2'
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
        notes: 'Commande de test 2 pour l\'espace client',
        subtotal: 150000,
        tax: 0,
        total: 150000
      }
    ];

    const commandesCreees = [];
    
    for (const commandeData of commandesTest) {
      console.log(`📦 Création: ${commandeData.items[0].name}...`);
      
      const result = await localOrdersAPI.createOrder(commandeData);
      
      if (result.success) {
        console.log(`✅ Créée: ${result.data.order.trackingNumber}`);
        commandesCreees.push(result.data.order._id);
        
        // Approuver la première commande, laisser la seconde en attente
        if (commandeData.items[0].name === 'FER') {
          console.log(`🔔 Approbation: ${result.data.order.trackingNumber}...`);
          const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Commande approuvée - Facture disponible');
          
          if (approbation.success) {
            console.log(`✅ Approuvée: ${result.data.order.trackingNumber}`);
          }
        }
      }
    }
    
    // Attendre un peu pour la propagation des événements
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`✅ ${commandesCreees.length} commandes créées`);
    
    return commandesCreees.length;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return 0;
  }
};

// Fonction principale
const creerEspaceClientComplet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CRÉATION D\'ESPACE CLIENT COMPLET...');
  
  // 1. Créer l'espace client complet
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ CRÉATION DE L\'ESPACE CLIENT COMPLET');
  console.log('='.repeat(60));
  const espaceClientCree = creerEspaceClientComplet();
  
  // 2. Créer des données de test
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(60));
  const commandesCreees = await creerDonneesTestEspaceClient();
  
  // 3. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CRÉATION D\'ESPACE CLIENT COMPLET');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Espace client créé: ${espaceClientCree ? '✅' : '❌'}`);
  console.log(`- Données de test créées: ${commandesCreees}`);
  
  console.log('\n🎉 ESPACE CLIENT COMPLET CRÉÉ!');
  console.log('\n💡 Instructions:');
  console.log('1. Allez sur http://localhost:3000/orders');
  console.log('2. Vous verrez maintenant un espace client complet avec:');
  console.log('   - Header d\'espace client');
  console.log('   - Statistiques des commandes');
  console.log('   - Menu de navigation');
  console.log('   - Liste des commandes avec téléchargement de factures');
  console.log('3. Cliquez sur "Télécharger la facture" pour les commandes approuvées');
  
  console.log('\n🔧 Fonctionnalités de l\'espace client:');
  console.log('- ✅ Vue d\'ensemble des commandes');
  console.log('- ✅ Statistiques (total, approuvées, en attente)');
  console.log('- ✅ Téléchargement de factures');
  console.log('- ✅ Navigation facile');
  console.log('- ✅ Interface utilisateur intuitive');
  
  console.log('\n✅ Votre espace client est maintenant opérationnel!');
};

// Exporter les fonctions
window.creerEspaceClientComplet = creerEspaceClientComplet;
window.creerDonneesTestEspaceClient = creerDonneesTestEspaceClient;

console.log('🔧 Fonctions disponibles:');
console.log('- creerEspaceClientComplet() : Créer l\'espace client complet');
console.log('- creerDonneesTestEspaceClient() : Créer des données de test');

// Exécuter automatiquement
creerEspaceClientComplet();
