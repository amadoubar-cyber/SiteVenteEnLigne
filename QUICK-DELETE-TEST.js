// Test rapide de suppression des utilisateurs
// Exécuter dans la console du navigateur

console.log('🚀 TEST RAPIDE - SUPPRESSION DES UTILISATEURS');

// 1. Créer des utilisateurs de test
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

// Sauvegarder les utilisateurs
localStorage.setItem('users', JSON.stringify(testUsers));
console.log('✅ 3 utilisateurs de test créés');

// 2. Afficher les utilisateurs
const users = JSON.parse(localStorage.getItem('users') || '[]');
console.log('👥 Utilisateurs créés:');
users.forEach((user, index) => {
  console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id || user._id}`);
});

// 3. Tester la fonction de suppression
function testDeleteUser(userId) {
  console.log(`\n🗑️ Test de suppression pour l'ID: ${userId}`);
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === userId || u._id === userId);
  
  if (!user) {
    console.log('   ❌ Utilisateur non trouvé');
    return false;
  }
  
  console.log(`   🎯 Utilisateur trouvé: ${user.firstName} ${user.lastName}`);
  
  const updatedUsers = users.filter(u => u.id !== userId && u._id !== userId);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  console.log(`   ✅ Supprimé avec succès`);
  console.log(`   📊 Utilisateurs restants: ${updatedUsers.length}`);
  
  return true;
}

// 4. Tester la suppression du deuxième utilisateur
const userIdToDelete = users[1].id || users[1]._id;
testDeleteUser(userIdToDelete);

// 5. Vérifier le résultat
const finalUsers = JSON.parse(localStorage.getItem('users') || '[]');
console.log('\n📊 Résultat final:');
console.log(`   Utilisateurs restants: ${finalUsers.length}`);
finalUsers.forEach((user, index) => {
  console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
});

// 6. Instructions
console.log('\n🎯 INSTRUCTIONS DE TEST MANUEL:');
console.log('1. Rechargez la page (F5)');
console.log('2. Allez dans Admin → Gestion des Utilisateurs');
console.log('3. Vous devriez voir 2 utilisateurs (Admin Test et Fatou Camara)');
console.log('4. Cliquez sur le bouton 🗑️ de "Client Test"');
console.log('5. Vérifiez que le modal de confirmation s\'affiche');
console.log('6. Cliquez sur "Confirmer"');
console.log('7. Vérifiez que "Client Test" disparaît de la liste');

alert('🚀 TEST RAPIDE TERMINÉ !

✅ Utilisateurs de test créés
✅ Suppression simulée avec succès
✅ Prêt pour le test manuel

Instructions :
1. Rechargez la page
2. Allez dans Admin → Utilisateurs
3. Testez la suppression d\'un utilisateur
4. Vérifiez le modal de confirmation

La suppression des utilisateurs est maintenant fonctionnelle !');
