/**
 * SOLUTION FINALE - CORRECTION DU CHIFFRE D'AFFAIRES
 * 
 * Ce script combine plusieurs méthodes pour corriger définitivement
 * le problème du chiffre d'affaires incorrect
 */

console.log('🎯 SOLUTION FINALE - CORRECTION DU CHIFFRE D\'AFFAIRES');
console.log('='.repeat(60));

// Étape 1: Nettoyer localStorage
console.log('\n🧹 ÉTAPE 1: Nettoyage de localStorage...');
const localKeys = Object.keys(localStorage);
localKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Supprimé: ${key}`);
});

// Étape 2: Nettoyer sessionStorage
console.log('\n🧹 ÉTAPE 2: Nettoyage de sessionStorage...');
const sessionKeys = Object.keys(sessionStorage);
sessionKeys.forEach(key => {
  sessionStorage.removeItem(key);
  console.log(`✅ Supprimé (session): ${key}`);
});

// Étape 3: Vider le cache du navigateur
console.log('\n🧹 ÉTAPE 3: Vidage du cache...');
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log(`✅ Cache supprimé: ${name}`);
    }
  });
}

// Étape 4: Supprimer les cookies
console.log('\n🧹 ÉTAPE 4: Suppression des cookies...');
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ Cookies supprimés');

// Étape 5: Forcer un rechargement complet
console.log('\n🔄 ÉTAPE 5: Rechargement complet...');
console.log('⏳ Rechargement en cours...');

// Méthode 1: Rechargement avec vidage du cache
setTimeout(() => {
  console.log('🔄 Rechargement avec vidage du cache...');
  window.location.reload(true);
}, 2000);

// Méthode 2: Si la première ne fonctionne pas
setTimeout(() => {
  console.log('🔄 Rechargement alternatif...');
  window.location.href = window.location.origin + window.location.pathname;
}, 5000);

console.log('\n' + '='.repeat(60));
console.log('🎉 SOLUTION FINALE APPLIQUÉE !');
console.log('\n💡 RÉSULTATS ATTENDUS:');
console.log('- Chiffre d\'affaires: 0 FG');
console.log('- Commandes: 0');
console.log('- Produits: 0');
console.log('- Utilisateurs: 1 (votre compte admin)');
console.log('\n🔄 Le navigateur va se recharger automatiquement...');
console.log('💡 Si le problème persiste, fermez complètement le navigateur');
console.log('💡 et rouvrez-le.');
