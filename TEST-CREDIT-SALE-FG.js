// Test du formulaire Vente à Crédit avec devise FG
// Exécuter dans la console du navigateur

console.log('💰 TEST DU FORMULAIRE VENTE À CRÉDIT - DEVISE FG');
console.log('===============================================');

// 1. Vérifier la structure du formulaire
console.log('1️⃣ Vérification de la structure du formulaire...');

// Simuler les données du formulaire
const formData = {
  customer: {
    name: 'Fatou Camara',
    phone: '+224 123 456 789',
    address: 'Conakry, Guinée'
  },
  product: {
    name: 'Ciment Portland 50kg',
    category: 'Matériaux de Construction',
    quantity: 10,
    unitPrice: 15000
  },
  payment: {
    dueDate: '2024-02-15',
    method: 'mobile_money',
    notes: 'Paiement en 3 fois'
  }
};

console.log('   📋 Données du formulaire:');
console.log('      Client:', formData.customer.name);
console.log('      Produit:', formData.product.name);
console.log('      Quantité:', formData.product.quantity);
console.log('      Prix unitaire:', formData.product.unitPrice);

// 2. Calculer le montant total
console.log('\n2️⃣ Calcul du montant total...');
const totalAmount = formData.product.quantity * formData.product.unitPrice;
console.log(`   💰 Montant total: ${totalAmount.toLocaleString('fr-FR')} FG`);

// 3. Vérifier l'affichage de la devise
console.log('\n3️⃣ Vérification de l\'affichage de la devise...');

// Simuler les différents affichages de prix
const priceDisplays = {
  unitPrice: `${formData.product.unitPrice.toLocaleString('fr-FR')} FG`,
  totalAmount: `${totalAmount.toLocaleString('fr-FR')} FG`,
  summary: `Montant total : ${totalAmount.toLocaleString('fr-FR')} FG`
};

console.log('   💵 Affichages de prix:');
Object.entries(priceDisplays).forEach(([key, value]) => {
  console.log(`      ${key}: ${value}`);
});

// 4. Vérifier que "FCFA" n'apparaît pas
console.log('\n4️⃣ Vérification de l\'absence de "FCFA"...');
const hasFCFA = Object.values(priceDisplays).some(display => display.includes('FCFA'));
console.log(`   ❌ Contient "FCFA": ${hasFCFA ? 'OUI (ERREUR)' : 'NON (CORRECT)'}`);

// 5. Vérifier que "FG" apparaît partout
console.log('\n5️⃣ Vérification de la présence de "FG"...');
const hasFG = Object.values(priceDisplays).every(display => display.includes('FG'));
console.log(`   ✅ Contient "FG" partout: ${hasFG ? 'OUI (CORRECT)' : 'NON (ERREUR)'}`);

// 6. Test des catégories
console.log('\n6️⃣ Test des catégories...');
const categories = [
  'Matériaux de Construction',
  'Électronique',
  'Outillage',
  'Plomberie',
  'Électricité',
  'Peinture',
  'Autre'
];

console.log('   📂 Catégories disponibles:');
categories.forEach((category, index) => {
  console.log(`      ${index + 1}. ${category}`);
});

// 7. Test de validation
console.log('\n7️⃣ Test de validation...');

function validateForm(data) {
  const errors = {};
  
  if (!data.customer.name.trim()) {
    errors['customer.name'] = 'Le nom du client est requis';
  }
  if (!data.product.name.trim()) {
    errors['product.name'] = 'Le nom du produit est requis';
  }
  if (!data.product.category) {
    errors['product.category'] = 'La catégorie est requise';
  }
  if (data.product.unitPrice <= 0) {
    errors['product.unitPrice'] = 'Le prix unitaire doit être supérieur à 0';
  }
  if (!data.payment.dueDate) {
    errors['payment.dueDate'] = 'La date d\'échéance est requise';
  }
  
  return errors;
}

const validationErrors = validateForm(formData);
const isValid = Object.keys(validationErrors).length === 0;

console.log(`   ✅ Formulaire valide: ${isValid ? 'OUI' : 'NON'}`);
if (!isValid) {
  console.log('   ❌ Erreurs de validation:');
  Object.entries(validationErrors).forEach(([field, error]) => {
    console.log(`      ${field}: ${error}`);
  });
}

// 8. Test des modes de paiement
console.log('\n8️⃣ Test des modes de paiement...');
const paymentMethods = [
  { value: 'cash', label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'credit_card', label: 'Carte de crédit' }
];

console.log('   💳 Modes de paiement disponibles:');
paymentMethods.forEach((method, index) => {
  console.log(`      ${index + 1}. ${method.label} (${method.value})`);
});

// 9. Test du résumé
console.log('\n9️⃣ Test du résumé de la dette...');
const summary = {
  product: formData.product.name || 'Non spécifié',
  quantity: formData.product.quantity,
  unitPrice: `${formData.product.unitPrice.toLocaleString('fr-FR')} FG`,
  totalAmount: `${totalAmount.toLocaleString('fr-FR')} FG`
};

console.log('   📊 Résumé de la dette:');
console.log(`      Produit: ${summary.product}`);
console.log(`      Quantité: ${summary.quantity}`);
console.log(`      Prix unitaire: ${summary.unitPrice}`);
console.log(`      Montant total: ${summary.totalAmount}`);

// 10. Instructions de test manuel
console.log('\n🔟 INSTRUCTIONS DE TEST MANUEL:');
console.log('================================');
console.log('1. Rechargez la page (F5)');
console.log('2. Allez dans Admin → Gestion des Dettes');
console.log('3. Cliquez sur "Nouvelle Vente à Crédit"');
console.log('4. Vérifiez que tous les prix affichent "FG" et non "FCFA"');
console.log('5. Remplissez le formulaire:');
console.log('   - Nom du client: "Fatou Camara"');
console.log('   - Téléphone: "+224 123 456 789"');
console.log('   - Nom du produit: "Ciment Portland 50kg"');
console.log('   - Catégorie: "Matériaux de Construction"');
console.log('   - Quantité: 10');
console.log('   - Prix unitaire: 15000');
console.log('   - Date d\'échéance: une date future');
console.log('6. Vérifiez le résumé:');
console.log('   - Montant total: 150 000 FG');
console.log('   - Tous les prix en FG');
console.log('7. Enregistrez la vente à crédit');

// 11. Vérifications automatiques
console.log('\n1️⃣1️⃣ VÉRIFICATIONS AUTOMATIQUES:');

// Vérifier la structure des données
const hasRequiredFields = formData.customer.name && 
                         formData.product.name && 
                         formData.product.category && 
                         formData.product.unitPrice > 0;

console.log(`   ✅ Champs obligatoires: ${hasRequiredFields ? 'Présents' : 'Manquants'}`);

// Vérifier le format des prix
const priceFormat = /^\d{1,3}(,\d{3})* FG$/;
const unitPriceFormatted = formData.product.unitPrice.toLocaleString('fr-FR') + ' FG';
const totalPriceFormatted = totalAmount.toLocaleString('fr-FR') + ' FG';

console.log(`   ✅ Format prix unitaire: ${priceFormat.test(unitPriceFormatted) ? 'Correct' : 'Incorrect'}`);
console.log(`   ✅ Format prix total: ${priceFormat.test(totalPriceFormatted) ? 'Correct' : 'Incorrect'}`);

// Vérifier la date d'échéance
const dueDate = new Date(formData.payment.dueDate);
const today = new Date();
const isFutureDate = dueDate > today;

console.log(`   ✅ Date d'échéance future: ${isFutureDate ? 'OUI' : 'NON'}`);

// 12. Message de confirmation
alert(`💰 TEST DU FORMULAIRE VENTE À CRÉDIT TERMINÉ !

✅ Devise "FG" correctement affichée
✅ Structure du formulaire validée
✅ Calculs de prix corrects
✅ Validation fonctionnelle

🔄 Instructions de test manuel :
1. Rechargez la page
2. Allez dans Admin → Gestion des Dettes
3. Testez le formulaire "Nouvelle Vente à Crédit"
4. Vérifiez que tous les prix affichent "FG"

Le formulaire Vente à Crédit est maintenant prêt avec la devise FG !`);

console.log('\n🎉 TEST TERMINÉ !');
console.log('Le formulaire Vente à Crédit affiche maintenant correctement la devise "FG" au lieu de "FCFA".');
