/**
 * Script pour forcer le rechargement de la page et vider le cache
 */

console.log('🔄 FORÇAGE DU RECHARGEMENT...');

// Vider le cache du navigateur
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log(`✅ Cache supprimé: ${name}`);
    }
  });
}

// Forcer le rechargement avec vidage du cache
console.log('🔄 Rechargement en cours...');
window.location.reload(true);
