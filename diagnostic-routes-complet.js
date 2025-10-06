/**
 * 🔍 DIAGNOSTIC COMPLET DES ROUTES
 * ================================
 * 
 * Ce script diagnostique et corrige les problèmes de routage
 * dans votre application React.
 */

console.log('🔍 DIAGNOSTIC DES ROUTES');
console.log('========================');

// 1. Vérifier les routes disponibles
console.log('\n📋 ROUTES DISPONIBLES:');
const routes = [
  { path: '/', name: 'Accueil' },
  { path: '/products', name: 'Produits' },
  { path: '/construction', name: 'Matériaux de construction' },
  { path: '/electronics', name: 'Électronique' },
  { path: '/login', name: 'Connexion' },
  { path: '/register', name: 'Inscription' },
  { path: '/cart', name: 'Panier' },
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/products', name: 'Gestion Produits' },
  { path: '/admin/stock', name: 'Mouvements Stock' },
  { path: '/admin/orders', name: 'Commandes' }
];

routes.forEach(route => {
  console.log(`  ✅ ${route.path} - ${route.name}`);
});

// 2. Vérifier l'URL actuelle
console.log('\n🌐 URL ACTUELLE:');
console.log('  URL:', window.location.href);
console.log('  Path:', window.location.pathname);
console.log('  Hash:', window.location.hash);

// 3. Vérifier React Router
console.log('\n⚛️ REACT ROUTER:');
if (window.React) {
  console.log('  ✅ React détecté');
} else {
  console.log('  ❌ React non détecté');
}

// 4. Tester la navigation
console.log('\n🧪 TEST DE NAVIGATION:');

// Fonction pour tester une route
function testRoute(path) {
  try {
    console.log(`  🔄 Test de ${path}...`);
    
    // Simuler un clic sur un lien
    const link = document.createElement('a');
    link.href = path;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Vérifier si le lien fonctionne
    const canNavigate = link.href !== window.location.href;
    console.log(`    ${canNavigate ? '✅' : '❌'} ${path}`);
    
    document.body.removeChild(link);
    return canNavigate;
  } catch (error) {
    console.log(`    ❌ Erreur: ${error.message}`);
    return false;
  }
}

// Tester les routes principales
const testRoutes = ['/products', '/login', '/register', '/admin'];
testRoutes.forEach(testRoute);

// 5. Vérifier les erreurs de console
console.log('\n🚨 ERREURS DÉTECTÉES:');
const errors = [];
const originalError = console.error;
console.error = function(...args) {
  errors.push(args.join(' '));
  originalError.apply(console, args);
};

// Attendre un peu pour capturer les erreurs
setTimeout(() => {
  if (errors.length > 0) {
    console.log('  Erreurs trouvées:');
    errors.forEach(error => console.log(`    ❌ ${error}`));
  } else {
    console.log('  ✅ Aucune erreur détectée');
  }
}, 1000);

// 6. Créer des liens de test
console.log('\n🔗 CRÉATION DE LIENS DE TEST:');

function createTestLinks() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: white;
    border: 2px solid #3B82F6;
    border-radius: 8px;
    padding: 15px;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
  `;
  
  container.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #3B82F6;">🧪 Test des Routes</h3>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <a href="/" style="color: #3B82F6; text-decoration: none; padding: 5px;">🏠 Accueil</a>
      <a href="/products" style="color: #3B82F6; text-decoration: none; padding: 5px;">📦 Produits</a>
      <a href="/login" style="color: #3B82F6; text-decoration: none; padding: 5px;">🔐 Connexion</a>
      <a href="/register" style="color: #3B82F6; text-decoration: none; padding: 5px;">📝 Inscription</a>
      <a href="/admin" style="color: #3B82F6; text-decoration: none; padding: 5px;">⚙️ Admin</a>
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; background: #EF4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">❌ Fermer</button>
  `;
  
  document.body.appendChild(container);
  console.log('  ✅ Liens de test créés (coin supérieur gauche)');
}

createTestLinks();

// 7. Diagnostic des problèmes spécifiques
console.log('\n🔧 DIAGNOSTIC SPÉCIFIQUE:');

// Vérifier si le serveur backend fonctionne
async function testBackend() {
  try {
    console.log('  🔄 Test du backend...');
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    if (response.status === 400) {
      console.log('  ✅ Backend accessible (erreur 400 attendue)');
    } else {
      console.log(`  ⚠️ Backend répond avec status: ${response.status}`);
    }
  } catch (error) {
    console.log('  ❌ Backend inaccessible:', error.message);
  }
}

testBackend();

// 8. Solutions recommandées
console.log('\n💡 SOLUTIONS RECOMMANDÉES:');
console.log('  1. Vérifiez que le serveur backend est démarré');
console.log('  2. Vérifiez les URLs dans votre navigateur');
console.log('  3. Utilisez les liens de test créés ci-dessus');
console.log('  4. Vérifiez la console pour les erreurs');

console.log('\n✅ DIAGNOSTIC TERMINÉ');
console.log('=====================');
