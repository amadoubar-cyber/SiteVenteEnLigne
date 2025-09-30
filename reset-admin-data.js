// Script pour réinitialiser les données admin et repartir à zéro
// Exécuter dans la console du navigateur

console.log('🧹 Nettoyage des données admin...');

// Supprimer toutes les données admin
localStorage.removeItem('adminProducts');
localStorage.removeItem('stockMovements');
localStorage.removeItem('clientOrders');
localStorage.removeItem('users');
localStorage.removeItem('adminCategories');

console.log('✅ Données admin supprimées !');
console.log('🔄 Rechargez la page pour voir l\'interface vide.');

// Vérifier que localStorage est vide
const remainingData = {
  adminProducts: localStorage.getItem('adminProducts'),
  stockMovements: localStorage.getItem('stockMovements'),
  clientOrders: localStorage.getItem('clientOrders'),
  users: localStorage.getItem('users'),
  adminCategories: localStorage.getItem('adminCategories')
};

console.log('📊 État de localStorage après nettoyage:', remainingData);

// Afficher un message de confirmation
alert('✅ Données admin supprimées !\n\nL\'interface sera maintenant vide.\nRechargez la page pour voir le résultat.');
