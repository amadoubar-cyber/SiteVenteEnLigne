// Script pour nettoyer toutes les données de test et fausses données
console.log('🧹 Nettoyage complet de toutes les données de test...');

// Fonction pour nettoyer le localStorage
function cleanLocalStorage() {
  console.log('📦 Nettoyage du localStorage...');
  
  // Liste des clés à nettoyer
  const keysToClean = [
    'salesData',
    'ordersData', 
    'adminOrders',
    'revenueData',
    'salesStats',
    'debts',
    'debtData',
    'adminDebts',
    'koula_products',
    'adminProducts',
    'productsData',
    'users',
    'adminUsers',
    'userData',
    'categories',
    'adminCategories',
    'categoryData',
    'stockMovements',
    'stockData'
  ];
  
  let cleanedCount = 0;
  keysToClean.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Supprimé: ${key}`);
      cleanedCount++;
    }
  });
  
  console.log(`📊 ${cleanedCount} clés nettoyées du localStorage`);
  return cleanedCount;
}

// Fonction pour nettoyer le sessionStorage
function cleanSessionStorage() {
  console.log('📦 Nettoyage du sessionStorage...');
  const beforeCount = Object.keys(sessionStorage).length;
  sessionStorage.clear();
  console.log(`✅ ${beforeCount} clés supprimées du sessionStorage`);
  return beforeCount;
}

// Fonction pour nettoyer les cookies
function cleanCookies() {
  console.log('🍪 Nettoyage des cookies...');
  const cookies = document.cookie.split(";");
  let cleanedCount = 0;
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name) {
      document.cookie = name + "=;expires=" + new Date().toUTCString() + ";path=/";
      cleanedCount++;
    }
  });
  
  console.log(`✅ ${cleanedCount} cookies supprimés`);
  return cleanedCount;
}

// Fonction pour vérifier les données restantes
function checkRemainingData() {
  console.log('🔍 Vérification des données restantes...');
  
  const allKeys = Object.keys(localStorage);
  const sessionKeys = Object.keys(sessionStorage);
  const cookieCount = document.cookie.split(';').filter(c => c.trim()).length;
  
  console.log(`📊 État après nettoyage:`);
  console.log(`  - localStorage: ${allKeys.length} clés restantes`);
  console.log(`  - sessionStorage: ${sessionKeys.length} clés restantes`);
  console.log(`  - cookies: ${cookieCount} cookies restants`);
  
  if (allKeys.length > 0) {
    console.log('📋 Clés restantes dans localStorage:');
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      const size = value ? value.length : 0;
      console.log(`  - ${key}: ${size} caractères`);
    });
  }
  
  return {
    localStorage: allKeys.length,
    sessionStorage: sessionKeys.length,
    cookies: cookieCount
  };
}

// Fonction principale
function cleanAllFakeData() {
  console.log('🚀 Début du nettoyage complet...');
  
  try {
    // Nettoyer localStorage
    const localStorageCleaned = cleanLocalStorage();
    
    // Nettoyer sessionStorage
    const sessionStorageCleaned = cleanSessionStorage();
    
    // Nettoyer cookies
    const cookiesCleaned = cleanCookies();
    
    // Vérifier les données restantes
    const remaining = checkRemainingData();
    
    console.log('🎉 Nettoyage terminé !');
    console.log(`📊 Résumé:`);
    console.log(`  - localStorage: ${localStorageCleaned} clés supprimées`);
    console.log(`  - sessionStorage: ${sessionStorageCleaned} clés supprimées`);
    console.log(`  - cookies: ${cookiesCleaned} cookies supprimés`);
    console.log(`  - Données restantes: ${remaining.localStorage + remaining.sessionStorage + remaining.cookies}`);
    
    if (remaining.localStorage === 0 && remaining.sessionStorage === 0 && remaining.cookies === 0) {
      console.log('✅ Nettoyage parfait - Aucune donnée restante');
    } else {
      console.log('⚠️ Certaines données persistent - vérification recommandée');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
}

// Exécuter le nettoyage si dans un navigateur
if (typeof window !== 'undefined') {
  console.log('🌐 Exécution dans le navigateur...');
  cleanAllFakeData();
  
  // Exposer la fonction globalement
  window.cleanAllFakeData = cleanAllFakeData;
  window.cleanLocalStorage = cleanLocalStorage;
  window.cleanSessionStorage = cleanSessionStorage;
  window.cleanCookies = cleanCookies;
  window.checkRemainingData = checkRemainingData;
  
  console.log('💡 Fonctions disponibles:');
  console.log('  - cleanAllFakeData() : Nettoyer tout');
  console.log('  - cleanLocalStorage() : Nettoyer localStorage seulement');
  console.log('  - checkRemainingData() : Vérifier les données restantes');
} else {
  console.log('⚠️ Ce script doit être exécuté dans un navigateur');
}

console.log('✅ Script de nettoyage chargé');
