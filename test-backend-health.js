/**
 * 🏥 Test de Santé du Backend - Bowoye Multi Services
 * 
 * Ce script teste si le backend est accessible et fonctionne correctement
 */

console.log('🏥 TEST DE SANTÉ DU BACKEND');
console.log('='.repeat(40));

const BACKEND_URL = 'https://bowoye-backend.onrender.com';
const API_URL = `${BACKEND_URL}/api`;

async function testBackendHealth() {
  console.log('\n🔍 Test de connexion au backend...');
  
  try {
    // Test 1: Health Check
    console.log(`📡 Test: ${API_URL}/health`);
    const healthResponse = await fetch(`${API_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check: OK');
      console.log(`   Message: ${healthData.message}`);
      console.log(`   Environment: ${healthData.environment}`);
      console.log(`   Timestamp: ${healthData.timestamp}`);
    } else {
      console.log(`❌ Health Check: ERREUR ${healthResponse.status}`);
      console.log(`   Status: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    // Test 2: API Products
    console.log(`\n📡 Test: ${API_URL}/products`);
    const productsResponse = await fetch(`${API_URL}/products`);
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ API Products: OK');
      console.log(`   Nombre de produits: ${productsData.data?.length || 0}`);
    } else {
      console.log(`❌ API Products: ERREUR ${productsResponse.status}`);
    }
    
    // Test 3: API Categories
    console.log(`\n📡 Test: ${API_URL}/categories`);
    const categoriesResponse = await fetch(`${API_URL}/categories`);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✅ API Categories: OK');
      console.log(`   Nombre de catégories: ${categoriesData.data?.length || 0}`);
    } else {
      console.log(`❌ API Categories: ERREUR ${categoriesResponse.status}`);
    }
    
    console.log('\n🎉 RÉSUMÉ DES TESTS:');
    console.log('Si tous les tests passent ✅, votre backend est fonctionnel !');
    console.log('Si des tests échouent ❌, vérifiez les logs Render.');
    
  } catch (error) {
    console.log('\n❌ ERREUR DE CONNEXION:');
    console.log(`   Message: ${error.message}`);
    console.log('   Vérifiez que le backend est démarré sur Render.');
  }
}

// Fonction pour tester plusieurs fois
async function testMultipleTimes(count = 3) {
  console.log(`\n🔄 Test ${count} fois pour vérifier la stabilité...`);
  
  for (let i = 1; i <= count; i++) {
    console.log(`\n--- Test ${i}/${count} ---`);
    await testBackendHealth();
    
    if (i < count) {
      console.log('\n⏳ Attente de 5 secondes...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Instructions d'utilisation
console.log('\n📖 INSTRUCTIONS:');
console.log('1. Ouvrir la console du navigateur (F12)');
console.log('2. Coller ce script');
console.log('3. Exécuter: testBackendHealth()');
console.log('4. Ou pour test multiple: testMultipleTimes(3)');

// Exposer les fonctions globalement si dans un navigateur
if (typeof window !== 'undefined') {
  window.testBackendHealth = testBackendHealth;
  window.testMultipleTimes = testMultipleTimes;
  console.log('\n🚀 Fonctions disponibles: testBackendHealth(), testMultipleTimes()');
} else {
  console.log('\n💡 Pour utiliser ce script:');
  console.log('1. Ouvrir https://bowoye-frontend.vercel.app');
  console.log('2. Ouvrir la console (F12)');
  console.log('3. Coller ce script');
  console.log('4. Exécuter: testBackendHealth()');
}

console.log('\n✅ Script de test prêt !');
