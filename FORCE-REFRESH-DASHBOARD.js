// Script pour forcer le rafraîchissement du tableau de bord
// Exécutez ce script dans la console du navigateur (F12 → Console)

console.log('🔄 Forçage du rafraîchissement du tableau de bord...');

// 1. Nettoyer le cache React Query
if (window.queryClient) {
  console.log('🧹 Nettoyage du cache React Query...');
  window.queryClient.clear();
  console.log('✅ Cache React Query nettoyé');
} else {
  console.log('⚠️ React Query non trouvé, nettoyage du localStorage...');
  
  // Nettoyer les clés de cache potentielles
  const cacheKeys = [
    'admin-products',
    'admin-order-stats', 
    'admin-recent-orders',
    'products',
    'orders',
    'categories'
  ];
  
  cacheKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Clé supprimée: ${key}`);
  });
}

// 2. Forcer le rechargement de la page avec cache bypass
console.log('🔄 Rechargement de la page...');
setTimeout(() => {
  window.location.reload(true);
}, 1000);

console.log('✅ Script de rafraîchissement exécuté !');
