/**
 * SCRIPT DE NETTOYAGE SPÉCIFIQUE - MOUVEMENTS DE STOCK SEULEMENT
 * 
 * Ce script supprime uniquement les mouvements de stock de test
 * sans affecter les autres données
 */

console.log('🧹 NETTOYAGE DES MOUVEMENTS DE STOCK...');

// Vérifier les données actuelles
const stockMovements = localStorage.getItem('stockMovements');
if (stockMovements) {
  const movements = JSON.parse(stockMovements);
  console.log(`📊 Mouvements trouvés: ${movements.length}`);
  
  // Afficher les détails avant suppression
  movements.forEach((movement, index) => {
    console.log(`- ${movement.productName} (${movement.type}): ${movement.quantity} - ${movement.date}`);
  });
}

// Supprimer uniquement les mouvements de stock
localStorage.removeItem('stockMovements');
localStorage.removeItem('testStockMovements');
localStorage.removeItem('demoStockMovements');

console.log('✅ Mouvements de stock supprimés !');

// Vérifier l'état après nettoyage
const remainingMovements = localStorage.getItem('stockMovements');
console.log(`📊 Mouvements restants: ${remainingMovements ? 'Oui' : 'Aucun'}`);

console.log('\n💡 MAINTENANT:');
console.log('- Actualisez la page');
console.log('- Les mouvements de stock ne s\'afficheront plus');
console.log('- L\'interface sera vide et prête pour vos vrais mouvements');

console.log('\n🔄 Actualisez maintenant la page !');
