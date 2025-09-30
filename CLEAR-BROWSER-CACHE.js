/**
 * Script pour vider complètement le cache du navigateur
 */

console.log('🧹 Vidage complet du cache du navigateur...');

// Supprimer localStorage
localStorage.clear();
console.log('✅ localStorage vidé');

// Supprimer sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage vidé');

// Supprimer les cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ Cookies supprimés');

// Vider le cache HTTP
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log(`✅ Cache supprimé: ${name}`);
    }
  });
}

// Forcer le rechargement avec vidage du cache
console.log('🔄 Rechargement avec vidage du cache...');
setTimeout(() => {
  // Méthode 1: Rechargement forcé
  window.location.reload(true);
  
  // Méthode 2: Si la première ne fonctionne pas
  setTimeout(() => {
    window.location.href = window.location.href;
  }, 2000);
  
  // Méthode 3: Redirection complète
  setTimeout(() => {
    window.location.replace(window.location.origin + window.location.pathname);
  }, 4000);
}, 1000);

console.log('🎉 Cache vidé et rechargement en cours...');
