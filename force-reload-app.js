// Script pour forcer le rechargement de l'application
console.log('🔄 Forçage du rechargement de l\'application...');

// Vider le cache du navigateur
if (typeof window !== 'undefined') {
  // Vider le localStorage
  localStorage.clear();
  console.log('✅ localStorage vidé');
  
  // Vider le sessionStorage
  sessionStorage.clear();
  console.log('✅ sessionStorage vidé');
  
  // Forcer le rechargement de la page
  console.log('🔄 Rechargement de la page...');
  window.location.reload(true);
} else {
  console.log('⚠️ Ce script doit être exécuté dans le navigateur');
}

console.log('🎉 Script terminé');
