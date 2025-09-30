/**
 * Script pour vider le cache et forcer un rechargement complet
 * 
 * Ce script supprime toutes les données et force le navigateur
 * à recharger complètement l'application
 */

console.log('🧹 VIDAGE DU CACHE ET RECHARGEMENT COMPLET...');

// Supprimer toutes les données localStorage
const localKeys = Object.keys(localStorage);
console.log(`🗑️ Suppression de ${localKeys.length} éléments de localStorage...`);
localKeys.forEach(key => localStorage.removeItem(key));

// Supprimer toutes les données sessionStorage
const sessionKeys = Object.keys(sessionStorage);
console.log(`🗑️ Suppression de ${sessionKeys.length} éléments de sessionStorage...`);
sessionKeys.forEach(key => sessionStorage.removeItem(key));

// Supprimer les cookies (si possible)
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Toutes les données supprimées !');

// Forcer le rechargement avec vidage du cache
console.log('🔄 Rechargement avec vidage du cache...');

// Méthode 1: Rechargement forcé
setTimeout(() => {
  window.location.reload(true);
}, 1000);

// Méthode 2: Si la première ne fonctionne pas
setTimeout(() => {
  console.log('🔄 Tentative de rechargement alternatif...');
  window.location.href = window.location.href;
}, 3000);

// Méthode 3: Redirection complète
setTimeout(() => {
  console.log('🔄 Redirection complète...');
  window.location.replace(window.location.origin + window.location.pathname);
}, 5000);

console.log('\n💡 Le navigateur va se recharger automatiquement...');
console.log('💡 Si le problème persiste, fermez complètement le navigateur');
console.log('💡 et rouvrez-le.');
