/**
 * SCRIPT DE NETTOYAGE NUCLÉAIRE - SUPPRIME TOUT
 * 
 * ⚠️ ATTENTION: Ce script supprime ABSOLUMENT TOUTES les données
 * et force un rechargement complet de l'application
 */

console.log('☢️ NETTOYAGE NUCLÉAIRE - SUPPRESSION TOTALE...');
console.log('⚠️  ATTENTION: TOUTES les données seront supprimées !');

// Supprimer TOUTES les clés localStorage
const allKeys = Object.keys(localStorage);
console.log(`🗑️ Suppression de ${allKeys.length} éléments...`);

allKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Supprimé: ${key}`);
});

// Supprimer aussi sessionStorage
const sessionKeys = Object.keys(sessionStorage);
console.log(`🗑️ Suppression de ${sessionKeys.length} éléments de session...`);

sessionKeys.forEach(key => {
  sessionStorage.removeItem(key);
  console.log(`✅ Supprimé (session): ${key}`);
});

// Vérifier que tout est vide
const remainingLocal = Object.keys(localStorage).length;
const remainingSession = Object.keys(sessionStorage).length;

console.log(`\n🎉 NETTOYAGE NUCLÉAIRE TERMINÉ !`);
console.log(`📊 Éléments restants dans localStorage: ${remainingLocal}`);
console.log(`📊 Éléments restants dans sessionStorage: ${remainingSession}`);

if (remainingLocal === 0 && remainingSession === 0) {
  console.log(`\n✅ SUCCÈS: Toutes les données ont été supprimées !`);
} else {
  console.log(`\n⚠️  ATTENTION: Il reste encore des données !`);
}

console.log(`\n💡 MAINTENANT:`);
console.log('- Fermez complètement le navigateur');
console.log('- Rouvrez le navigateur');
console.log('- Allez sur votre site');
console.log('- Le tableau de bord devrait afficher 0 partout');

console.log(`\n🔄 FERMEZ LE NAVIGATEUR MAINTENANT !`);

// Forcer un rechargement après 3 secondes
setTimeout(() => {
  console.log('🔄 Rechargement forcé en cours...');
  window.location.reload(true);
}, 3000);
