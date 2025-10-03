// Script de réparation du localStorage corrompu
console.log('🔧 Réparation du localStorage...');

// Vider et réinitialiser le localStorage des produits
localStorage.removeItem('koula_products');
localStorage.setItem('koula_products', '[]');

console.log('✅ localStorage réinitialisé avec succès');
console.log('📦 Vous pouvez maintenant ajouter des produits');
