// Script de test pour vérifier la suppression du champ "Code postal"
// À exécuter dans la console du navigateur

console.log('🧪 TEST - SUPPRESSION DU CHAMP CODE POSTAL');
console.log('=' .repeat(50));

// Fonction pour vérifier la page de checkout
const verifierCheckout = () => {
  console.log('\n🔍 VÉRIFICATION DE LA PAGE CHECKOUT:');
  
  // Vérifier l'URL actuelle
  const currentUrl = window.location.href;
  console.log(`📍 URL actuelle: ${currentUrl}`);
  
  if (!currentUrl.includes('/checkout')) {
    console.log('⚠️ Vous n\'êtes pas sur la page checkout');
    console.log('💡 Allez sur la page checkout pour tester');
    return false;
  }
  
  // Vérifier les champs du formulaire
  const firstNameField = document.querySelector('input[name="shippingAddress.firstName"]');
  const lastNameField = document.querySelector('input[name="shippingAddress.lastName"]');
  const streetField = document.querySelector('input[name="shippingAddress.street"]');
  const cityField = document.querySelector('input[name="shippingAddress.city"]');
  const postalCodeField = document.querySelector('input[name="shippingAddress.postalCode"]');
  const phoneField = document.querySelector('input[name="shippingAddress.phone"]');
  
  console.log('📋 Champs trouvés:');
  console.log(`   ✅ Prénom: ${firstNameField ? 'Trouvé' : '❌ Non trouvé'}`);
  console.log(`   ✅ Nom: ${lastNameField ? 'Trouvé' : '❌ Non trouvé'}`);
  console.log(`   ✅ Adresse: ${streetField ? 'Trouvé' : '❌ Non trouvé'}`);
  console.log(`   ✅ Ville: ${cityField ? 'Trouvé' : '❌ Non trouvé'}`);
  console.log(`   ❌ Code postal: ${postalCodeField ? '❌ ENCORE PRÉSENT!' : '✅ Supprimé'}`);
  console.log(`   ✅ Téléphone: ${phoneField ? 'Trouvé' : '❌ Non trouvé'}`);
  
  // Vérifier les labels
  const labels = document.querySelectorAll('label');
  const postalCodeLabel = Array.from(labels).find(label => 
    label.textContent.includes('Code postal')
  );
  
  console.log(`🏷️ Label "Code postal": ${postalCodeLabel ? '❌ ENCORE PRÉSENT!' : '✅ Supprimé'}`);
  
  // Vérifier la structure de la grille
  const gridElements = document.querySelectorAll('.grid');
  console.log(`📐 Éléments de grille trouvés: ${gridElements.length}`);
  
  // Vérifier les méthodes de paiement
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  console.log(`💳 Méthodes de paiement: ${paymentMethods.length}`);
  
  paymentMethods.forEach((method, index) => {
    const label = method.closest('label');
    const text = label ? label.textContent.trim() : 'N/A';
    console.log(`   ${index + 1}. ${text}`);
  });
  
  return {
    postalCodeRemoved: !postalCodeField && !postalCodeLabel,
    fieldsPresent: {
      firstName: !!firstNameField,
      lastName: !!lastNameField,
      street: !!streetField,
      city: !!cityField,
      phone: !!phoneField
    },
    paymentMethodsCount: paymentMethods.length
  };
};

// Fonction pour tester la soumission du formulaire
const testerSoumissionFormulaire = () => {
  console.log('\n🧪 TEST DE SOUMISSION DU FORMULAIRE:');
  
  // Vérifier que le formulaire existe
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ Aucun formulaire trouvé');
    return false;
  }
  
  console.log('✅ Formulaire trouvé');
  
  // Remplir les champs obligatoires
  const firstNameField = document.querySelector('input[name="shippingAddress.firstName"]');
  const lastNameField = document.querySelector('input[name="shippingAddress.lastName"]');
  const streetField = document.querySelector('input[name="shippingAddress.street"]');
  const cityField = document.querySelector('input[name="shippingAddress.city"]');
  const phoneField = document.querySelector('input[name="shippingAddress.phone"]');
  
  if (firstNameField && lastNameField && streetField && cityField && phoneField) {
    console.log('📝 Remplissage des champs de test...');
    
    firstNameField.value = 'Test';
    lastNameField.value = 'Utilisateur';
    streetField.value = '123 Rue Test';
    cityField.value = 'Conakry';
    phoneField.value = '+224 123 456 789';
    
    // Déclencher les événements change
    [firstNameField, lastNameField, streetField, cityField, phoneField].forEach(field => {
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    console.log('✅ Champs remplis avec succès');
    
    // Vérifier que le champ postalCode n'existe pas dans les données
    const formData = new FormData(form);
    const hasPostalCode = formData.has('shippingAddress.postalCode');
    console.log(`🔍 Champ postalCode dans FormData: ${hasPostalCode ? '❌ PRÉSENT!' : '✅ Absent'}`);
    
    return !hasPostalCode;
  } else {
    console.log('❌ Certains champs obligatoires manquent');
    return false;
  }
};

// Fonction pour vérifier la structure HTML
const verifierStructureHTML = () => {
  console.log('\n🏗️ VÉRIFICATION DE LA STRUCTURE HTML:');
  
  // Vérifier les éléments de la section adresse
  const addressSection = document.querySelector('h2');
  const addressTitle = addressSection ? addressSection.textContent : '';
  console.log(`📍 Titre section adresse: ${addressTitle}`);
  
  // Compter les champs input dans la section adresse
  const addressInputs = document.querySelectorAll('input[type="text"], input[type="tel"]');
  console.log(`📝 Champs input trouvés: ${addressInputs.length}`);
  
  addressInputs.forEach((input, index) => {
    const name = input.name || 'sans nom';
    const placeholder = input.placeholder || 'sans placeholder';
    console.log(`   ${index + 1}. ${name} - "${placeholder}"`);
  });
  
  // Vérifier la structure de la grille
  const gridContainers = document.querySelectorAll('.grid');
  console.log(`📐 Conteneurs de grille: ${gridContainers.length}`);
  
  return {
    addressInputsCount: addressInputs.length,
    gridContainersCount: gridContainers.length
  };
};

// Fonction principale de test
const testCompletCheckout = () => {
  console.log('🚀 DÉMARRAGE DU TEST COMPLET CHECKOUT...');
  
  // 1. Vérifier la page checkout
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DE LA PAGE CHECKOUT');
  console.log('='.repeat(50));
  const checkoutState = verifierCheckout();
  
  // 2. Vérifier la structure HTML
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION DE LA STRUCTURE HTML');
  console.log('='.repeat(50));
  const htmlState = verifierStructureHTML();
  
  // 3. Tester la soumission du formulaire
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ TEST DE SOUMISSION DU FORMULAIRE');
  console.log('='.repeat(50));
  const formState = testerSoumissionFormulaire();
  
  // 4. Résumé
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU TEST CHECKOUT');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Code postal supprimé: ${checkoutState.postalCodeRemoved ? '✅' : '❌'}`);
  console.log(`- Champs présents: ${Object.values(checkoutState.fieldsPresent).every(Boolean) ? '✅' : '❌'}`);
  console.log(`- Méthodes de paiement: ${checkoutState.paymentMethodsCount}`);
  console.log(`- Champs input: ${htmlState.addressInputsCount}`);
  console.log(`- Formulaire fonctionnel: ${formState ? '✅' : '❌'}`);
  
  if (checkoutState.postalCodeRemoved && formState) {
    console.log('\n🎉 SUCCÈS: Le champ "Code postal" a été supprimé avec succès!');
    console.log('✅ Le formulaire fonctionne correctement sans ce champ');
  } else {
    console.log('\n❌ ÉCHEC: Le champ "Code postal" est encore présent ou le formulaire ne fonctionne pas');
  }
  
  console.log('\n💡 Instructions pour tester manuellement:');
  console.log('1. Allez sur la page checkout');
  console.log('2. Vérifiez que le champ "Code postal" n\'apparaît plus');
  console.log('3. Remplissez les autres champs obligatoires');
  console.log('4. Testez la soumission du formulaire');
};

// Exporter les fonctions
window.verifierCheckout = verifierCheckout;
window.verifierStructureHTML = verifierStructureHTML;
window.testerSoumissionFormulaire = testerSoumissionFormulaire;
window.testCompletCheckout = testCompletCheckout;

console.log('🔧 Fonctions de test disponibles:');
console.log('- verifierCheckout() : Vérifier la page checkout');
console.log('- verifierStructureHTML() : Vérifier la structure HTML');
console.log('- testerSoumissionFormulaire() : Tester la soumission');
console.log('- testCompletCheckout() : Test complet');

// Exécuter automatiquement si on est sur la page checkout
if (window.location.href.includes('/checkout')) {
  testCompletCheckout();
} else {
  console.log('💡 Allez sur la page checkout pour exécuter automatiquement le test');
}
