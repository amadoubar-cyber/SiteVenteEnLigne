// Script de diagnostic pour le problème du panier
// À exécuter dans la console du navigateur

console.log('🛒 DIAGNOSTIC PROBLÈME PANIER');
console.log('=' .repeat(40));

// Fonction pour vérifier les produits et leur stock
const verifierProduitsStock = () => {
  console.log('\n📦 VÉRIFICATION DES PRODUITS ET STOCK:');
  
  // Vérifier les produits dans localStorage
  const productsData = localStorage.getItem('koula_products');
  const adminProducts = localStorage.getItem('adminProducts');
  const productsData2 = localStorage.getItem('productsData');
  
  console.log(`📦 koula_products: ${productsData ? 'Présent' : 'Absent'}`);
  console.log(`📦 adminProducts: ${adminProducts ? 'Présent' : 'Absent'}`);
  console.log(`📦 productsData: ${productsData2 ? 'Présent' : 'Absent'}`);
  
  let allProducts = [];
  
  // Essayer de parser les données
  if (productsData) {
    try {
      const parsed = JSON.parse(productsData);
      console.log(`📦 koula_products: ${parsed.length || 'Erreur'} produits`);
      if (Array.isArray(parsed)) {
        allProducts = [...allProducts, ...parsed];
      }
    } catch (error) {
      console.error('❌ Erreur parsing koula_products:', error);
    }
  }
  
  if (adminProducts) {
    try {
      const parsed = JSON.parse(adminProducts);
      console.log(`📦 adminProducts: ${parsed.length || 'Erreur'} produits`);
      if (Array.isArray(parsed)) {
        allProducts = [...allProducts, ...parsed];
      }
    } catch (error) {
      console.error('❌ Erreur parsing adminProducts:', error);
    }
  }
  
  if (productsData2) {
    try {
      const parsed = JSON.parse(productsData2);
      console.log(`📦 productsData: ${parsed.length || 'Erreur'} produits`);
      if (Array.isArray(parsed)) {
        allProducts = [...allProducts, ...parsed];
      }
    } catch (error) {
      console.error('❌ Erreur parsing productsData:', error);
    }
  }
  
  // Supprimer les doublons
  const uniqueProducts = allProducts.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  );
  
  console.log(`📦 Total produits uniques: ${uniqueProducts.length}`);
  
  if (uniqueProducts.length > 0) {
    console.log('\n📋 DÉTAILS DES PRODUITS:');
    uniqueProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name || 'Sans nom'}`);
      console.log(`      ID: ${product._id}`);
      console.log(`      Prix: ${product.price || 'Non défini'} GNF`);
      console.log(`      Stock: ${product.stock || 'Non défini'}`);
      console.log(`      Catégorie: ${product.category || 'Non définie'}`);
      console.log(`      Publié: ${product.isPublished !== false ? 'Oui' : 'Non'}`);
      console.log('      ---');
    });
    
    // Chercher spécifiquement le produit FER
    const ferProduct = uniqueProducts.find(p => 
      p.name && p.name.toLowerCase().includes('fer')
    );
    
    if (ferProduct) {
      console.log('\n🔍 PRODUIT FER TROUVÉ:');
      console.log(`   Nom: ${ferProduct.name}`);
      console.log(`   ID: ${ferProduct._id}`);
      console.log(`   Prix: ${ferProduct.price} GNF`);
      console.log(`   Stock: ${ferProduct.stock}`);
      console.log(`   Publié: ${ferProduct.isPublished !== false ? 'Oui' : 'Non'}`);
      
      if (ferProduct.stock === 0) {
        console.log('❌ PROBLÈME: Stock = 0, c\'est pourquoi le bouton est grisé!');
      } else if (ferProduct.stock > 0) {
        console.log('✅ Stock disponible, le bouton devrait être actif');
      }
    } else {
      console.log('❌ PRODUIT FER NON TROUVÉ');
    }
  }
  
  return uniqueProducts;
};

// Fonction pour corriger le stock du produit FER
const corrigerStockFer = () => {
  console.log('\n🔧 CORRECTION DU STOCK FER:');
  
  const productsData = localStorage.getItem('koula_products');
  if (!productsData) {
    console.log('❌ Aucune donnée de produits trouvée');
    return false;
  }
  
  try {
    const products = JSON.parse(productsData);
    const ferProduct = products.find(p => 
      p.name && p.name.toLowerCase().includes('fer')
    );
    
    if (!ferProduct) {
      console.log('❌ Produit FER non trouvé');
      return false;
    }
    
    console.log(`📦 Stock actuel: ${ferProduct.stock}`);
    
    // Mettre le stock à 10
    ferProduct.stock = 10;
    
    // Sauvegarder
    localStorage.setItem('koula_products', JSON.stringify(products));
    
    console.log(`✅ Stock corrigé: ${ferProduct.stock}`);
    console.log('🔄 Rechargez la page pour voir les changements');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour créer un produit de test avec stock
const creerProduitTest = () => {
  console.log('\n🧪 CRÉATION D\'UN PRODUIT DE TEST:');
  
  const testProduct = {
    _id: 'test-product-' + Date.now(),
    name: 'Produit Test',
    description: 'Produit de test pour vérifier le panier',
    price: 50000,
    stock: 5,
    category: 'test',
    productType: 'construction',
    images: ['test-image-1'],
    isPublished: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  try {
    // Récupérer les produits existants
    const existingProducts = JSON.parse(localStorage.getItem('koula_products') || '[]');
    
    // Ajouter le produit de test
    existingProducts.push(testProduct);
    
    // Sauvegarder
    localStorage.setItem('koula_products', JSON.stringify(existingProducts));
    
    console.log('✅ Produit de test créé:', testProduct.name);
    console.log(`📦 Stock: ${testProduct.stock}`);
    console.log(`💰 Prix: ${testProduct.price} GNF`);
    console.log('🔄 Rechargez la page pour voir le nouveau produit');
    
    return testProduct._id;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
};

// Fonction pour vérifier le contexte du panier
const verifierContextePanier = () => {
  console.log('\n🛒 VÉRIFICATION DU CONTEXTE PANIER:');
  
  // Vérifier si le contexte du panier est disponible
  const cartItems = localStorage.getItem('cartItems');
  console.log(`🛒 Éléments dans le panier: ${cartItems ? JSON.parse(cartItems).length : 0}`);
  
  // Vérifier les erreurs dans la console
  console.log('🔍 Vérifiez la console pour les erreurs liées au panier');
  
  return {
    cartItems: cartItems ? JSON.parse(cartItems) : []
  };
};

// Fonction pour tester l'ajout au panier
const testerAjoutPanier = async () => {
  console.log('\n🧪 TEST D\'AJOUT AU PANIER:');
  
  try {
    // Récupérer les produits
    const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
    const productAvecStock = products.find(p => p.stock > 0);
    
    if (!productAvecStock) {
      console.log('❌ Aucun produit avec stock trouvé');
      return false;
    }
    
    console.log(`📦 Test avec: ${productAvecStock.name} (Stock: ${productAvecStock.stock})`);
    
    // Simuler l'ajout au panier
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(item => item.product._id === productAvecStock._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        product: productAvecStock,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    console.log('✅ Produit ajouté au panier (simulation)');
    console.log(`🛒 Total éléments: ${cartItems.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale de diagnostic
const diagnosticPanierComplet = async () => {
  console.log('🚀 DÉMARRAGE DU DIAGNOSTIC PANIER...');
  
  // 1. Vérifier les produits et stock
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DES PRODUITS ET STOCK');
  console.log('='.repeat(50));
  const products = verifierProduitsStock();
  
  // 2. Vérifier le contexte panier
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION DU CONTEXTE PANIER');
  console.log('='.repeat(50));
  const contextePanier = verifierContextePanier();
  
  // 3. Corriger le stock FER si nécessaire
  const ferProduct = products.find(p => 
    p.name && p.name.toLowerCase().includes('fer')
  );
  
  if (ferProduct && ferProduct.stock === 0) {
    console.log('\n' + '='.repeat(50));
    console.log('3️⃣ CORRECTION DU STOCK FER');
    console.log('='.repeat(50));
    corrigerStockFer();
  }
  
  // 4. Créer un produit de test si aucun produit avec stock
  const produitsAvecStock = products.filter(p => p.stock > 0);
  if (produitsAvecStock.length === 0) {
    console.log('\n' + '='.repeat(50));
    console.log('4️⃣ CRÉATION D\'UN PRODUIT DE TEST');
    console.log('='.repeat(50));
    creerProduitTest();
  }
  
  // 5. Tester l'ajout au panier
  console.log('\n' + '='.repeat(50));
  console.log('5️⃣ TEST D\'AJOUT AU PANIER');
  console.log('='.repeat(50));
  await testerAjoutPanier();
  
  // 6. Résumé
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC PANIER');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Produits total: ${products.length}`);
  console.log(`- Produits avec stock: ${produitsAvecStock.length}`);
  console.log(`- Éléments dans panier: ${contextePanier.cartItems.length}`);
  
  if (ferProduct) {
    console.log(`- Produit FER stock: ${ferProduct.stock}`);
  }
  
  if (produitsAvecStock.length === 0) {
    console.log('\n❌ PROBLÈME: Aucun produit avec stock disponible!');
    console.log('💡 Solution: Corrigez le stock des produits ou créez un produit de test');
  } else {
    console.log('\n✅ PRODUITS AVEC STOCK DISPONIBLES!');
    console.log('💡 Le bouton devrait être actif pour ces produits');
  }
  
  console.log('\n💡 Instructions:');
  console.log('1. Rechargez la page après les corrections');
  console.log('2. Vérifiez que le bouton n\'est plus grisé');
  console.log('3. Testez l\'ajout au panier');
};

// Exporter les fonctions
window.verifierProduitsStock = verifierProduitsStock;
window.corrigerStockFer = corrigerStockFer;
window.creerProduitTest = creerProduitTest;
window.verifierContextePanier = verifierContextePanier;
window.testerAjoutPanier = testerAjoutPanier;
window.diagnosticPanierComplet = diagnosticPanierComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierProduitsStock() : Vérifier les produits et stock');
console.log('- corrigerStockFer() : Corriger le stock du produit FER');
console.log('- creerProduitTest() : Créer un produit de test');
console.log('- verifierContextePanier() : Vérifier le contexte panier');
console.log('- testerAjoutPanier() : Tester l\'ajout au panier');
console.log('- diagnosticPanierComplet() : Diagnostic complet');

// Exécuter automatiquement
diagnosticPanierComplet();
