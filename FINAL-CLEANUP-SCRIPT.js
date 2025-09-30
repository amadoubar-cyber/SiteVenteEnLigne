// Script de nettoyage complet pour le test final
// Exécuter dans la console du navigateur

console.log('🧹 NETTOYAGE COMPLET DU PROJET - TEST FINAL');
console.log('==========================================');

// 1. Supprimer toutes les données de test
console.log('1️⃣ Suppression des données de test...');

const keysToRemove = [
  'adminProducts',
  'stockMovements', 
  'clientOrders',
  'users',
  'adminCategories',
  'debts',
  'sales',
  'testData',
  'mockData'
];

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`   ✅ ${key} supprimé`);
  } else {
    console.log(`   ⚪ ${key} n'existait pas`);
  }
});

// 2. Vérifier que localStorage est vide
console.log('\n2️⃣ Vérification de localStorage...');
const remainingKeys = Object.keys(localStorage).filter(key => 
  key.includes('admin') || 
  key.includes('product') || 
  key.includes('order') || 
  key.includes('user') ||
  key.includes('stock') ||
  key.includes('sale') ||
  key.includes('debt')
);

if (remainingKeys.length === 0) {
  console.log('   ✅ localStorage complètement nettoyé');
} else {
  console.log('   ⚠️  Clés restantes:', remainingKeys);
  remainingKeys.forEach(key => localStorage.removeItem(key));
  console.log('   ✅ Clés restantes supprimées');
}

// 3. Afficher l'état final
console.log('\n3️⃣ État final de localStorage:');
const finalState = {
  adminProducts: localStorage.getItem('adminProducts'),
  stockMovements: localStorage.getItem('stockMovements'),
  clientOrders: localStorage.getItem('clientOrders'),
  users: localStorage.getItem('users'),
  adminCategories: localStorage.getItem('adminCategories')
};

Object.entries(finalState).forEach(([key, value]) => {
  console.log(`   ${key}: ${value ? '❌ EXISTE ENCORE' : '✅ VIDE'}`);
});

// 4. Instructions pour le test
console.log('\n4️⃣ INSTRUCTIONS POUR LE TEST FINAL:');
console.log('=====================================');
console.log('1. Rechargez la page (F5)');
console.log('2. Vérifiez que toutes les interfaces sont vides:');
console.log('   - Gestion des Produits: "Aucun produit trouvé"');
console.log('   - Contrôle de Stock: Toutes les valeurs à 0');
console.log('   - Mouvements de Stock: Aucun mouvement');
console.log('   - Gestion des Ventes: Aucune vente');
console.log('   - Dashboard: Toutes les statistiques à 0');
console.log('3. Testez l\'ajout de produits un par un');
console.log('4. Vérifiez la synchronisation entre les interfaces');

// 5. Message de confirmation
alert(`🧹 NETTOYAGE COMPLET TERMINÉ !

✅ Toutes les données de test ont été supprimées
✅ localStorage est maintenant vide
✅ Le projet est prêt pour le test final

🔄 Rechargez la page pour voir l'interface vide
📝 Testez l'ajout de produits un par un
🎯 Vérifiez la synchronisation entre les interfaces

Le projet est maintenant prêt pour le test final !`);

console.log('\n🎉 NETTOYAGE TERMINÉ - PRÊT POUR LE TEST FINAL !');
