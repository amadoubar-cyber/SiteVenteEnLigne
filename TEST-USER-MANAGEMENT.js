// Script de test pour la gestion des utilisateurs
// Exécuter dans la console du navigateur

console.log('👥 TEST DE LA GESTION DES UTILISATEURS');
console.log('=====================================');

// 1. Nettoyer les données existantes
console.log('1️⃣ Nettoyage des données utilisateurs...');
localStorage.removeItem('users');
console.log('   ✅ Données utilisateurs supprimées');

// 2. Créer des utilisateurs de test
console.log('\n2️⃣ Création d\'utilisateurs de test...');

const testUsers = [
  {
    _id: '1',
    id: 1,
    firstName: 'Fatou',
    lastName: 'Camara',
    email: 'fatou.camara@email.com',
    phone: '+224 123 456 789',
    address: 'Conakry, Guinée',
    role: 'client',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0
  },
  {
    _id: '2',
    id: 2,
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou.diallo@admin.com',
    phone: '+224 987 654 321',
    address: 'Conakry, Guinée',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0
  },
  {
    _id: '3',
    id: 3,
    firstName: 'Aissatou',
    lastName: 'Bah',
    email: 'aissatou.bah@email.com',
    phone: '+224 555 123 456',
    address: 'Kankan, Guinée',
    role: 'client',
    isActive: false,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0
  }
];

localStorage.setItem('users', JSON.stringify(testUsers));
console.log('   ✅ 3 utilisateurs de test créés');

// 3. Vérifier les données
console.log('\n3️⃣ Vérification des données...');
const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
console.log(`   📊 Nombre d'utilisateurs: ${savedUsers.length}`);
console.log('   👥 Utilisateurs créés:');
savedUsers.forEach((user, index) => {
  console.log(`      ${index + 1}. ${user.firstName} ${user.lastName} (${user.role}) - ${user.isActive ? 'Actif' : 'Inactif'}`);
});

// 4. Instructions de test
console.log('\n4️⃣ INSTRUCTIONS DE TEST:');
console.log('========================');
console.log('1. Rechargez la page (F5)');
console.log('2. Allez dans Admin → Gestion des Utilisateurs');
console.log('3. Vérifiez que 3 utilisateurs sont affichés');
console.log('4. Testez les fonctionnalités suivantes:');
console.log('   ✅ Ajouter un nouvel utilisateur');
console.log('   ✅ Modifier les informations d\'un utilisateur');
console.log('   ✅ Changer le statut (actif/inactif)');
console.log('   ✅ Supprimer un utilisateur');
console.log('   ✅ Rechercher par nom/email');
console.log('   ✅ Filtrer par rôle et statut');
console.log('   ✅ Sélectionner plusieurs utilisateurs');
console.log('   ✅ Actions en lot (suppression, changement de statut)');
console.log('   ✅ Exporter les données en CSV');

// 5. Vérifications automatiques
console.log('\n5️⃣ VÉRIFICATIONS AUTOMATIQUES:');

// Vérifier la structure des données
const isValidStructure = testUsers.every(user => 
  user._id && user.id && user.firstName && user.lastName && 
  user.email && user.role && typeof user.isActive === 'boolean'
);

console.log(`   ✅ Structure des données: ${isValidStructure ? 'Valide' : 'Invalide'}`);

// Vérifier les rôles
const roles = [...new Set(testUsers.map(user => user.role))];
console.log(`   ✅ Rôles disponibles: ${roles.join(', ')}`);

// Vérifier les statuts
const activeUsers = testUsers.filter(user => user.isActive).length;
const inactiveUsers = testUsers.filter(user => !user.isActive).length;
console.log(`   ✅ Utilisateurs actifs: ${activeUsers}`);
console.log(`   ✅ Utilisateurs inactifs: ${inactiveUsers}`);

// 6. Message de confirmation
alert(`👥 UTILISATEURS DE TEST CRÉÉS !

✅ 3 utilisateurs de test ajoutés
✅ Données sauvegardées dans localStorage
✅ Prêt pour les tests de gestion

🔄 Rechargez la page et testez les fonctionnalités :
• Ajout/Modification/Suppression
• Recherche et filtrage
• Gestion en lot
• Export CSV

La gestion des utilisateurs est prête à être testée !`);

console.log('\n🎉 UTILISATEURS DE TEST PRÊTS !');
console.log('Rechargez la page pour commencer les tests.');
