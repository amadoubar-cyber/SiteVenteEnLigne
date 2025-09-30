/**
 * Script de nettoyage du localStorage pour résoudre les problèmes de quota
 * Exécutez ce script dans la console du navigateur pour nettoyer le localStorage
 */

console.log('🧹 Nettoyage du localStorage en cours...');

// Fonction pour nettoyer le localStorage
function clearLocalStorage() {
  try {
    // Sauvegarder les données importantes si nécessaire
    const cartItems = localStorage.getItem('cartItems');
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    console.log('📊 Données trouvées:');
    console.log('- cartItems:', cartItems ? JSON.parse(cartItems).length + ' éléments' : 'aucun');
    console.log('- authToken:', authToken ? 'présent' : 'aucun');
    console.log('- user:', userData ? 'présent' : 'aucun');
    
    // Nettoyer tout le localStorage
    localStorage.clear();
    
    console.log('✅ localStorage nettoyé avec succès');
    console.log('🔄 Rechargez la page pour appliquer les changements');
    
    // Optionnel: recréer des données de base
    if (authToken && userData) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', userData);
      console.log('🔐 Données d\'authentification restaurées');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
}

// Fonction pour vérifier la taille du localStorage
function checkLocalStorageSize() {
  let totalSize = 0;
  const items = {};
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length;
      totalSize += size;
      items[key] = {
        size: size,
        sizeKB: (size / 1024).toFixed(2) + ' KB'
      };
    }
  }
  
  console.log('📏 Taille du localStorage:');
  console.log('- Total:', (totalSize / 1024).toFixed(2) + ' KB');
  console.log('- Détail des éléments:');
  console.table(items);
  
  return { totalSize, items };
}

// Exécuter les fonctions
console.log('🔍 Vérification de la taille actuelle...');
checkLocalStorageSize();

console.log('\n🧹 Démarrage du nettoyage...');
clearLocalStorage();

console.log('\n✅ Script terminé. Rechargez la page pour continuer.');
