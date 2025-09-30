/**
 * DIAGNOSTIC ULTIME - Identifier la source exacte des données
 * 
 * Ce script examine TOUTES les sources possibles de données
 */

console.log('🔍 DIAGNOSTIC ULTIME - IDENTIFICATION DE LA SOURCE');
console.log('='.repeat(60));

// 1. Vérifier localStorage
console.log('\n📦 LOCALSTORAGE:');
const localKeys = Object.keys(localStorage);
if (localKeys.length > 0) {
  localKeys.forEach(key => {
    const value = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        console.log(`- ${key}: ${parsed.length} éléments`);
        if (parsed.length > 0 && parsed[0].totalAmount) {
          console.log(`  💰 Total: ${parsed.reduce((sum, item) => sum + (item.totalAmount || 0), 0).toLocaleString('fr-FR')} FG`);
        }
      } else {
        console.log(`- ${key}: ${value.length} caractères`);
      }
    } catch {
      console.log(`- ${key}: ${value.length} caractères`);
    }
  });
} else {
  console.log('- Aucune donnée localStorage');
}

// 2. Vérifier sessionStorage
console.log('\n📦 SESSIONSTORAGE:');
const sessionKeys = Object.keys(sessionStorage);
if (sessionKeys.length > 0) {
  sessionKeys.forEach(key => {
    const value = sessionStorage.getItem(key);
    console.log(`- ${key}: ${value.length} caractères`);
  });
} else {
  console.log('- Aucune donnée sessionStorage');
}

// 3. Vérifier les cookies
console.log('\n🍪 COOKIES:');
const cookies = document.cookie;
if (cookies) {
  console.log(`- Cookies présents: ${cookies.length} caractères`);
  console.log(`- Contenu: ${cookies}`);
} else {
  console.log('- Aucun cookie');
}

// 4. Tester les endpoints API
console.log('\n🌐 TEST DES ENDPOINTS API:');
async function testAPI() {
  const baseUrl = window.location.origin;
  
  try {
    // Test des statistiques
    const statsResponse = await fetch(`${baseUrl}/api/orders/stats`);
    const statsData = await statsResponse.json();
    console.log(`📊 /api/orders/stats:`, statsData);
    
    // Test des commandes
    const ordersResponse = await fetch(`${baseUrl}/api/orders?limit=5`);
    const ordersData = await ordersResponse.json();
    console.log(`📋 /api/orders:`, ordersData);
    
  } catch (error) {
    console.log(`❌ Erreur API: ${error.message}`);
  }
}

// 5. Vérifier les fichiers JSON potentiels
console.log('\n📄 FICHIERS JSON POTENTIELS:');
const jsonFiles = [
  '/adminProducts.json',
  '/products-data.json',
  '/orders.json',
  '/sales.json',
  '/test-data.json'
];

jsonFiles.forEach(async (file) => {
  try {
    const response = await fetch(file);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${file}: ${Array.isArray(data) ? data.length : 'Object'} éléments`);
    }
  } catch (error) {
    // Fichier n'existe pas ou erreur
  }
});

// 6. Vérifier le cache du navigateur
console.log('\n💾 CACHE DU NAVIGATEUR:');
if ('caches' in window) {
  caches.keys().then(function(names) {
    if (names.length > 0) {
      console.log(`- Caches trouvés: ${names.join(', ')}`);
      names.forEach(name => {
        caches.open(name).then(cache => {
          cache.keys().then(requests => {
            console.log(`  - ${name}: ${requests.length} entrées`);
          });
        });
      });
    } else {
      console.log('- Aucun cache trouvé');
    }
  });
} else {
  console.log('- Cache API non disponible');
}

// 7. Vérifier les variables globales
console.log('\n🌍 VARIABLES GLOBALES:');
const globalVars = ['window.orders', 'window.products', 'window.sales', 'window.testData'];
globalVars.forEach(varName => {
  try {
    const value = eval(varName);
    if (value) {
      console.log(`- ${varName}: ${Array.isArray(value) ? value.length : 'Object'} éléments`);
    }
  } catch (error) {
    // Variable n'existe pas
  }
});

// Lancer les tests API
testAPI();

console.log('\n' + '='.repeat(60));
console.log('✅ Diagnostic ultime terminé !');
console.log('\n💡 Analysez les résultats ci-dessus pour identifier');
console.log('   la source exacte des données de test.');
