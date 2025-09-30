// Script de diagnostic et correction
console.log('🔍 Diagnostic de l\'application...');

// Fonction pour diagnostiquer les données
function diagnoseData() {
  console.log('📊 Diagnostic des données localStorage:');
  
  const keys = [
    'salesData', 'ordersData', 'adminOrders', 'revenueData', 'salesStats',
    'koula_products', 'adminProducts', 'productsData',
    'users', 'adminUsers', 'userData',
    'categories', 'adminCategories', 'categoryData'
  ];
  
  let totalItems = 0;
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const count = Array.isArray(parsed) ? parsed.length : 'object';
        console.log(`  ✅ ${key}: ${count} éléments`);
        totalItems++;
      } catch (e) {
        console.log(`  ❌ ${key}: données corrompues`);
      }
    } else {
      console.log(`  ⚪ ${key}: vide`);
    }
  });
  
  console.log(`📈 Total: ${totalItems} types de données trouvées`);
  return totalItems;
}

// Fonction pour nettoyer complètement
function cleanAllData() {
  console.log('🧹 Nettoyage complet...');
  
  // Vider localStorage
  localStorage.clear();
  console.log('✅ localStorage vidé');
  
  // Vider sessionStorage
  sessionStorage.clear();
  console.log('✅ sessionStorage vidé');
  
  // Vider les cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  console.log('✅ Cookies vidés');
  
  console.log('🎉 Nettoyage terminé');
}

// Fonction pour vérifier si les boutons sont présents
function checkResetButtons() {
  console.log('🔍 Vérification des boutons de réinitialisation...');
  
  // Chercher les boutons ResetButton
  const resetButtons = document.querySelectorAll('[class*="reset-button"], [class*="ResetButton"]');
  console.log(`📊 Boutons ResetButton trouvés: ${resetButtons.length}`);
  
  // Chercher les boutons avec le texte "Réinitialiser"
  const resetTextButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.includes('Réinitialiser') || btn.textContent.includes('réinitialiser')
  );
  console.log(`📊 Boutons "Réinitialiser" trouvés: ${resetTextButtons.length}`);
  
  // Chercher les icônes de rotation
  const rotateIcons = document.querySelectorAll('[class*="RotateCcw"], [class*="rotate"]');
  console.log(`📊 Icônes de rotation trouvées: ${rotateIcons.length}`);
  
  return {
    resetButtons: resetButtons.length,
    resetTextButtons: resetTextButtons.length,
    rotateIcons: rotateIcons.length
  };
}

// Exécuter le diagnostic
if (typeof window !== 'undefined') {
  console.log('🌐 Exécution dans le navigateur...');
  
  const dataCount = diagnoseData();
  const buttonInfo = checkResetButtons();
  
  console.log('📋 Résumé:');
  console.log(`  - Données: ${dataCount} types trouvés`);
  console.log(`  - Boutons ResetButton: ${buttonInfo.resetButtons}`);
  console.log(`  - Boutons "Réinitialiser": ${buttonInfo.resetTextButtons}`);
  console.log(`  - Icônes rotation: ${buttonInfo.rotateIcons}`);
  
  if (dataCount > 0) {
    console.log('⚠️ Des données persistent - nettoyage recommandé');
    console.log('💡 Exécutez: cleanAllData() pour nettoyer');
  }
  
  if (buttonInfo.resetButtons === 0 && buttonInfo.resetTextButtons === 0) {
    console.log('⚠️ Aucun bouton de réinitialisation trouvé');
    console.log('💡 Vérifiez que l\'application React est chargée');
  }
  
  // Exposer les fonctions globalement
  window.diagnoseData = diagnoseData;
  window.cleanAllData = cleanAllData;
  window.checkResetButtons = checkResetButtons;
  
} else {
  console.log('⚠️ Ce script doit être exécuté dans le navigateur');
}

console.log('✅ Diagnostic terminé');
