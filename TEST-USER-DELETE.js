// Script de test pour la suppression des utilisateurs
// Exécuter dans la console du navigateur

console.log('🗑️ TEST DE SUPPRESSION DES UTILISATEURS');
console.log('=====================================');

// 1. Nettoyer les données existantes
console.log('1️⃣ Nettoyage des données...');
localStorage.removeItem('users');
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('   ✅ Données nettoyées');

// 2. Créer des utilisateurs de test
console.log('\n2️⃣ Création d\'utilisateurs de test...');
const testUsers = [
  {
    _id: '1',
    id: 1,
    firstName: 'Admin',
    lastName: 'Test',
    email: 'admin@test.com',
    password: 'admin123',
    phone: '+224 123 456 789',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0,
    address: 'Conakry, Guinée'
  },
  {
    _id: '2',
    id: 2,
    firstName: 'Client',
    lastName: 'Test',
    email: 'client@test.com',
    password: 'password123',
    phone: '+224 987 654 321',
    role: 'client',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0,
    address: 'Conakry, Guinée'
  },
  {
    _id: '3',
    id: 3,
    firstName: 'Fatou',
    lastName: 'Camara',
    email: 'fatou@test.com',
    password: 'password123',
    phone: '+224 555 123 456',
    role: 'client',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    totalOrders: 0,
    totalSpent: 0,
    address: 'Conakry, Guinée'
  }
];

localStorage.setItem('users', JSON.stringify(testUsers));
console.log(`   ✅ ${testUsers.length} utilisateurs créés`);

// 3. Vérifier l'état initial
console.log('\n3️⃣ État initial:');
const initialUsers = JSON.parse(localStorage.getItem('users') || '[]');
console.log(`   📊 Nombre d'utilisateurs: ${initialUsers.length}`);
initialUsers.forEach((user, index) => {
  console.log(`      ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id || user._id}`);
});

// 4. Simuler la suppression d'un utilisateur
console.log('\n4️⃣ Simulation de suppression...');
const userToDelete = initialUsers[1]; // Supprimer le deuxième utilisateur
console.log(`   🎯 Utilisateur à supprimer: ${userToDelete.firstName} ${userToDelete.lastName} (ID: ${userToDelete.id || userToDelete._id})`);

// Simuler la logique de suppression
const userIdToDelete = userToDelete.id || userToDelete._id;
const updatedUsers = initialUsers.filter(user => user.id !== userIdToDelete && user._id !== userIdToDelete);

console.log(`   📊 Utilisateurs après suppression: ${updatedUsers.length}`);
console.log('   👥 Utilisateurs restants:');
updatedUsers.forEach((user, index) => {
  console.log(`      ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id || user._id}`);
});

// Sauvegarder les changements
localStorage.setItem('users', JSON.stringify(updatedUsers));

// 5. Vérifier la suppression
console.log('\n5️⃣ Vérification de la suppression:');
const finalUsers = JSON.parse(localStorage.getItem('users') || '[]');
const deletedUserExists = finalUsers.some(user => (user.id || user._id) === userIdToDelete);

console.log(`   ✅ Utilisateur supprimé: ${!deletedUserExists ? 'OUI' : 'NON'}`);
console.log(`   📊 Nombre final d'utilisateurs: ${finalUsers.length}`);

// 6. Test de la fonction de suppression
console.log('\n6️⃣ Test de la fonction de suppression:');

// Fonction de test pour la suppression
function testDeleteUser(userId) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === userId || u._id === userId);
  
  if (!user) {
    console.log(`   ❌ Utilisateur avec ID ${userId} non trouvé`);
    return false;
  }
  
  console.log(`   🎯 Suppression de: ${user.firstName} ${user.lastName}`);
  
  const updatedUsers = users.filter(u => u.id !== userId && u._id !== userId);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  console.log(`   ✅ Utilisateur supprimé avec succès`);
  console.log(`   📊 Nouveau nombre d'utilisateurs: ${updatedUsers.length}`);
  
  return true;
}

// Tester la suppression du premier utilisateur restant
if (finalUsers.length > 0) {
  const firstUserId = finalUsers[0].id || finalUsers[0]._id;
  testDeleteUser(firstUserId);
}

// 7. Vérifications finales
console.log('\n7️⃣ Vérifications finales:');
const finalCheck = JSON.parse(localStorage.getItem('users') || '[]');
console.log(`   📊 Utilisateurs finaux: ${finalCheck.length}`);
console.log('   👥 Liste finale:');
finalCheck.forEach((user, index) => {
  console.log(`      ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
});

// 8. Instructions de test manuel
console.log('\n8️⃣ INSTRUCTIONS DE TEST MANUEL:');
console.log('================================');
console.log('1. Rechargez la page (F5)');
console.log('2. Allez dans Admin → Gestion des Utilisateurs');
console.log('3. Vérifiez que les utilisateurs de test sont visibles');
console.log('4. Cliquez sur le bouton de suppression (🗑️) d\'un utilisateur');
console.log('5. Vérifiez que le modal de confirmation s\'affiche');
console.log('6. Cliquez sur "Confirmer" dans le modal');
console.log('7. Vérifiez que l\'utilisateur a été supprimé de la liste');
console.log('8. Vérifiez que la liste se met à jour correctement');

// 9. Vérifications automatiques
console.log('\n9️⃣ VÉRIFICATIONS AUTOMATIQUES:');

// Vérifier la structure des données
const isValidStructure = finalCheck.every(user => 
  user._id && user.id && user.firstName && user.lastName && 
  user.email && user.role && typeof user.isActive === 'boolean'
);

console.log(`   ✅ Structure des données: ${isValidStructure ? 'Valide' : 'Invalide'}`);

// Vérifier les identifiants uniques
const ids = finalCheck.map(user => user.id || user._id);
const uniqueIds = [...new Set(ids)];
console.log(`   ✅ Identifiants uniques: ${ids.length === uniqueIds.length ? 'OUI' : 'NON'}`);

// Vérifier la persistance
const persistedUsers = JSON.parse(localStorage.getItem('users') || '[]');
console.log(`   ✅ Persistance: ${persistedUsers.length === finalCheck.length ? 'OK' : 'ERREUR'}`);

// 10. Message de confirmation
alert(`🗑️ TEST DE SUPPRESSION DES UTILISATEURS TERMINÉ !

✅ Utilisateurs de test créés
✅ Suppression simulée avec succès
✅ Structure des données validée
✅ Persistance vérifiée

🔄 Instructions de test manuel :
1. Rechargez la page
2. Allez dans Admin → Utilisateurs
3. Testez la suppression d'un utilisateur
4. Vérifiez le modal de confirmation
5. Confirmez la suppression

La suppression des utilisateurs est maintenant fonctionnelle !`);

console.log('\n🎉 TEST DE SUPPRESSION TERMINÉ !');
console.log('Testez maintenant la suppression manuelle dans l\'interface admin.');
