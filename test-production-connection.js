/**
 * 🧪 Script de Test de Connexion en Production
 * 
 * Ce script teste la connexion entre le frontend et le backend en production
 */

console.log('🧪 TEST DE CONNEXION EN PRODUCTION');
console.log('='.repeat(50));

// URLs de production
const PRODUCTION_URLS = {
  frontend: 'https://bowoye-frontend.vercel.app',
  backend: 'https://bowoye-backend.onrender.com',
  api: 'https://bowoye-backend.onrender.com/api'
};

console.log('\n📍 URLs DE PRODUCTION:');
Object.entries(PRODUCTION_URLS).forEach(([service, url]) => {
  console.log(`${service.toUpperCase()}: ${url}`);
});

// Tests à effectuer
console.log('\n🔍 TESTS À EFFECTUER:');

console.log('\n1️⃣ TEST BACKEND (Render):');
console.log('   • Ouvrir: https://bowoye-backend.onrender.com/api/health');
console.log('   • Résultat attendu: {"success":true,"message":"API Koula E-commerce fonctionne correctement"}');
console.log('   • Status: 200 OK');

console.log('\n2️⃣ TEST FRONTEND (Vercel):');
console.log('   • Ouvrir: https://bowoye-frontend.vercel.app');
console.log('   • Résultat attendu: Page d\'accueil se charge');
console.log('   • Vérifier: Pas d\'erreurs dans la console (F12)');

console.log('\n3️⃣ TEST CONNEXION FRONTEND-BACKEND:');
console.log('   • Ouvrir: https://bowoye-frontend.vercel.app');
console.log('   • Ouvrir la console du navigateur (F12)');
console.log('   • Aller sur la page de connexion');
console.log('   • Résultat attendu: Pas d\'erreurs CORS');

console.log('\n4️⃣ TEST AUTHENTIFICATION:');
console.log('   • Page: https://bowoye-frontend.vercel.app/login');
console.log('   • Tester la connexion avec un compte de test');
console.log('   • Résultat attendu: Connexion réussie ou message d\'erreur approprié');

console.log('\n5️⃣ TEST API ENDPOINTS:');
console.log('   • GET /api/products');
console.log('   • GET /api/categories');
console.log('   • POST /api/auth/login');
console.log('   • Résultat attendu: Réponses JSON valides');

// Tests automatiques avec fetch
console.log('\n🤖 TESTS AUTOMATIQUES:');

async function testBackendHealth() {
  try {
    console.log('\n🔍 Test de santé du backend...');
    const response = await fetch(`${PRODUCTION_URLS.api}/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Backend: OK');
      console.log(`   Message: ${data.message}`);
      console.log(`   Timestamp: ${data.timestamp}`);
    } else {
      console.log('❌ Backend: ERREUR');
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, data);
    }
  } catch (error) {
    console.log('❌ Backend: CONNEXION IMPOSSIBLE');
    console.log(`   Erreur: ${error.message}`);
  }
}

async function testProductsAPI() {
  try {
    console.log('\n🔍 Test de l\'API produits...');
    const response = await fetch(`${PRODUCTION_URLS.api}/products`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Produits: OK');
      console.log(`   Nombre de produits: ${data.data?.length || 0}`);
    } else {
      console.log('❌ API Produits: ERREUR');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ API Produits: CONNEXION IMPOSSIBLE');
    console.log(`   Erreur: ${error.message}`);
  }
}

async function testCategoriesAPI() {
  try {
    console.log('\n🔍 Test de l\'API catégories...');
    const response = await fetch(`${PRODUCTION_URLS.api}/categories`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Catégories: OK');
      console.log(`   Nombre de catégories: ${data.data?.length || 0}`);
    } else {
      console.log('❌ API Catégories: ERREUR');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ API Catégories: CONNEXION IMPOSSIBLE');
    console.log(`   Erreur: ${error.message}`);
  }
}

// Exécuter les tests automatiques
async function runAllTests() {
  console.log('\n🚀 LANCEMENT DES TESTS AUTOMATIQUES...');
  
  await testBackendHealth();
  await testProductsAPI();
  await testCategoriesAPI();
  
  console.log('\n📋 RÉSUMÉ DES TESTS:');
  console.log('Vérifiez les résultats ci-dessus.');
  console.log('Si tous les tests passent ✅, votre application est fonctionnelle en production !');
  console.log('Si des tests échouent ❌, vérifiez la configuration des variables d\'environnement.');
}

// Instructions pour les tests manuels
console.log('\n📖 INSTRUCTIONS POUR LES TESTS MANUELS:');

console.log('\n🔧 Test Backend:');
console.log('1. Ouvrir: https://bowoye-backend.onrender.com/api/health');
console.log('2. Vérifier la réponse JSON');
console.log('3. Vérifier le status HTTP (200)');

console.log('\n🌐 Test Frontend:');
console.log('1. Ouvrir: https://bowoye-frontend.vercel.app');
console.log('2. Vérifier que la page se charge');
console.log('3. Ouvrir la console (F12)');
console.log('4. Vérifier qu\'il n\'y a pas d\'erreurs');

console.log('\n🔗 Test Connexion:');
console.log('1. Aller sur la page de connexion');
console.log('2. Essayer de se connecter');
console.log('3. Vérifier que les requêtes API fonctionnent');
console.log('4. Vérifier qu\'il n\'y a pas d\'erreurs CORS');

// Lancer les tests si exécuté dans un navigateur
if (typeof window !== 'undefined') {
  console.log('\n🚀 Tests automatiques disponibles dans la console du navigateur');
  console.log('Exécutez: runAllTests() pour lancer tous les tests');
  
  // Exposer la fonction globalement
  window.runAllTests = runAllTests;
} else {
  console.log('\n💡 Pour exécuter les tests automatiques:');
  console.log('1. Ouvrir https://bowoye-frontend.vercel.app');
  console.log('2. Ouvrir la console (F12)');
  console.log('3. Coller ce script dans la console');
  console.log('4. Exécuter: runAllTests()');
}

console.log('\n✅ SCRIPT DE TEST PRÊT !');
