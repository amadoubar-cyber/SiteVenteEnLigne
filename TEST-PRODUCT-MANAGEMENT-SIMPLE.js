/**
 * Script de test pour ProductManagementSimple avec prix d'achat
 * Exécutez ce script dans la console du navigateur sur la page d'administration
 */

console.log('🧪 Test du composant ProductManagementSimple avec prix d\'achat');

// Fonction pour tester l'ajout d'un produit avec prix d'achat
function testAddProductWithPurchasePrice() {
  console.log('📝 Test d\'ajout de produit avec prix d\'achat dans ProductManagementSimple...');
  
  // Simuler les données d'un produit
  const testProduct = {
    _id: Date.now().toString(),
    name: 'Test Produit Simple avec Prix d\'Achat',
    description: 'Produit de test pour vérifier le fonctionnement du prix d\'achat dans ProductManagementSimple',
    price: 200000, // Prix de vente
    purchasePrice: 150000, // Prix d'achat
    stock: 15,
    productType: 'electronics',
    category: 'Électronique',
    featured: false,
    isPublished: true,
    images: [{ url: '/test-image-1.jpg' }],
    createdAt: new Date().toISOString()
  };
  
  // Récupérer les produits existants
  const existingProducts = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  // Ajouter le produit de test
  const updatedProducts = [testProduct, ...existingProducts];
  localStorage.setItem('koula_products', JSON.stringify(updatedProducts));
  
  console.log('✅ Produit de test ajouté:', testProduct);
  console.log('💰 Prix de vente:', testProduct.price, 'FG');
  console.log('🛒 Prix d\'achat:', testProduct.purchasePrice, 'FG');
  console.log('📊 Marge unitaire:', testProduct.price - testProduct.purchasePrice, 'FG');
  console.log('📈 Marge en %:', Math.round(((testProduct.price - testProduct.purchasePrice) / testProduct.purchasePrice) * 100), '%');
  
  return testProduct;
}

// Fonction pour vérifier les calculs de marge
function testMarginCalculations() {
  console.log('🧮 Test des calculs de marge pour ProductManagementSimple...');
  
  const testCases = [
    { purchasePrice: 100000, sellingPrice: 150000, expectedMargin: 50 },
    { purchasePrice: 50000, sellingPrice: 75000, expectedMargin: 50 },
    { purchasePrice: 200000, sellingPrice: 250000, expectedMargin: 25 },
    { purchasePrice: 100000, sellingPrice: 200000, expectedMargin: 100 }
  ];
  
  testCases.forEach((testCase, index) => {
    const actualMargin = Math.round(((testCase.sellingPrice - testCase.purchasePrice) / testCase.purchasePrice) * 100);
    const unitMargin = testCase.sellingPrice - testCase.purchasePrice;
    
    console.log(`Test ${index + 1}:`);
    console.log(`  Prix d'achat: ${testCase.purchasePrice} FG`);
    console.log(`  Prix de vente: ${testCase.sellingPrice} FG`);
    console.log(`  Marge attendue: ${testCase.expectedMargin}%`);
    console.log(`  Marge calculée: ${actualMargin}%`);
    console.log(`  Marge unitaire: ${unitMargin} FG`);
    console.log(`  ✅ ${actualMargin === testCase.expectedMargin ? 'CORRECT' : 'ERREUR'}`);
    console.log('');
  });
}

// Fonction pour nettoyer les données de test
function cleanTestData() {
  console.log('🧹 Nettoyage des données de test ProductManagementSimple...');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  const filteredProducts = products.filter(product => 
    !product.name.includes('Test Produit Simple avec Prix d\'Achat')
  );
  
  localStorage.setItem('koula_products', JSON.stringify(filteredProducts));
  console.log('✅ Données de test nettoyées');
}

// Fonction pour afficher le résumé des produits
function showProductsSummary() {
  console.log('📊 Résumé des produits ProductManagementSimple...');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  if (products.length === 0) {
    console.log('❌ Aucun produit trouvé');
    return;
  }
  
  console.log(`📦 Total des produits: ${products.length}`);
  
  const productsWithPurchasePrice = products.filter(p => p.purchasePrice);
  console.log(`💰 Produits avec prix d'achat: ${productsWithPurchasePrice.length}`);
  
  if (productsWithPurchasePrice.length > 0) {
    const totalMargin = productsWithPurchasePrice.reduce((sum, product) => {
      return sum + (product.price - product.purchasePrice);
    }, 0);
    
    const avgMargin = totalMargin / productsWithPurchasePrice.length;
    console.log(`📈 Marge moyenne: ${avgMargin.toFixed(0)} FG`);
  }
  
  console.log('📋 Liste des produits:');
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   💰 Vente: ${product.price} FG`);
    console.log(`   🛒 Achat: ${product.purchasePrice || 'Non défini'} FG`);
    if (product.purchasePrice) {
      const margin = product.price - product.purchasePrice;
      const marginPercent = Math.round((margin / product.purchasePrice) * 100);
      console.log(`   📊 Marge: ${margin} FG (${marginPercent}%)`);
    }
    console.log('');
  });
}

// Fonction pour simuler la saisie dans le formulaire
function simulateFormInput() {
  console.log('📝 Simulation de saisie dans le formulaire...');
  
  // Simuler les données de formulaire
  const formData = {
    name: 'Produit Test Form',
    description: 'Description du produit test',
    price: '180000',
    purchasePrice: '120000',
    stock: '20',
    productType: 'electronics',
    category: 'Électronique',
    featured: false,
    isPublished: true,
    images: []
  };
  
  console.log('📋 Données du formulaire simulées:');
  console.log('- Nom:', formData.name);
  console.log('- Prix de vente:', formData.price, 'FG');
  console.log('- Prix d\'achat:', formData.purchasePrice, 'FG');
  console.log('- Stock:', formData.stock);
  console.log('- Type:', formData.productType);
  console.log('- Catégorie:', formData.category);
  
  // Calculer la marge
  const sellingPrice = parseFloat(formData.price);
  const purchasePrice = parseFloat(formData.purchasePrice);
  const margin = sellingPrice - purchasePrice;
  const marginPercent = Math.round((margin / purchasePrice) * 100);
  
  console.log('💰 Calculs de marge:');
  console.log('- Marge unitaire:', margin, 'FG');
  console.log('- Marge en %:', marginPercent + '%');
  
  return formData;
}

// Menu interactif
function showTestMenu() {
  console.log('🎯 Menu de test ProductManagementSimple avec prix d\'achat:');
  console.log('1. testAddProductWithPurchasePrice() - Ajouter un produit de test');
  console.log('2. testMarginCalculations() - Tester les calculs de marge');
  console.log('3. simulateFormInput() - Simuler la saisie dans le formulaire');
  console.log('4. showProductsSummary() - Afficher le résumé des produits');
  console.log('5. cleanTestData() - Nettoyer les données de test');
  console.log('6. showTestMenu() - Afficher ce menu');
  console.log('');
  console.log('💡 Exemple d\'utilisation:');
  console.log('   testAddProductWithPurchasePrice()');
}

// Exécuter les tests automatiquement
console.log('🚀 Exécution des tests automatiques...');
testMarginCalculations();
simulateFormInput();
showProductsSummary();
showTestMenu();

console.log('✅ Tests terminés. Utilisez le menu ci-dessus pour plus de tests.');
console.log('🔄 Rechargez la page pour voir les modifications dans l\'interface.');
