/**
 * Script pour vérifier les réponses de l'API serveur
 * 
 * Ce script teste les endpoints de l'API pour voir si le problème
 * vient du serveur qui retourne des données de test
 */

console.log('🔍 VÉRIFICATION DES RÉPONSES DE L\'API SERVEUR...');

// Fonction pour tester un endpoint
async function testEndpoint(url, description) {
  try {
    console.log(`\n📡 Test: ${description}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Données reçues:`, data);
    
    // Analyser les données
    if (data.data) {
      if (data.data.overview) {
        console.log(`💰 Chiffre d'affaires: ${data.data.overview.totalRevenue || 'N/A'}`);
        console.log(`📦 Commandes: ${data.data.overview.totalOrders || 'N/A'}`);
      }
      if (data.data.orders) {
        console.log(`📋 Nombre de commandes: ${data.data.orders.length}`);
        if (data.data.orders.length > 0) {
          let total = 0;
          data.data.orders.forEach(order => {
            total += order.totalAmount || order.total || 0;
          });
          console.log(`💰 Total calculé: ${total.toLocaleString('fr-FR')} FG`);
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Tester les endpoints principaux
async function runTests() {
  const baseUrl = window.location.origin;
  
  await testEndpoint(`${baseUrl}/api/orders/stats`, 'Statistiques des commandes');
  await testEndpoint(`${baseUrl}/api/orders?limit=5`, 'Commandes récentes');
  await testEndpoint(`${baseUrl}/api/products?limit=5`, 'Produits récents');
  
  console.log('\n✅ Tests terminés !');
  console.log('\n💡 Si vous voyez des données dans ces réponses,');
  console.log('   le problème vient du serveur qui retourne des données de test.');
}

// Lancer les tests
runTests();
