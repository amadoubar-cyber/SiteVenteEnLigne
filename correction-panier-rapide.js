// Script de correction rapide pour le problème du panier
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION RAPIDE - PROBLÈME PANIER');
console.log('=' .repeat(50));

// Fonction pour corriger rapidement le stock de tous les produits
const corrigerStockRapide = () => {
  console.log('\n🔧 CORRECTION RAPIDE DU STOCK:');
  
  try {
    // Vérifier les différentes sources de données
    const sources = ['koula_products', 'adminProducts', 'productsData'];
    let corrected = false;
    
    sources.forEach(source => {
      const data = localStorage.getItem(source);
      if (data) {
        try {
          const products = JSON.parse(data);
          if (Array.isArray(products)) {
            let modified = false;
            
            products.forEach(product => {
              if (product.stock === 0 || product.stock === undefined || product.stock === null) {
                product.stock = 10; // Mettre un stock de 10
                modified = true;
                console.log(`✅ ${product.name || 'Produit sans nom'}: Stock corrigé à 10`);
              }
            });
            
            if (modified) {
              localStorage.setItem(source, JSON.stringify(products));
              corrected = true;
              console.log(`📦 ${source}: ${products.length} produits mis à jour`);
            }
          }
        } catch (error) {
          console.error(`❌ Erreur avec ${source}:`, error);
        }
      }
    });
    
    if (corrected) {
      console.log('\n🎉 CORRECTION TERMINÉE!');
      console.log('🔄 Rechargez la page pour voir les changements');
      console.log('✅ Les boutons "Ajouter au panier" ne devraient plus être grisés');
    } else {
      console.log('\n❌ Aucune correction nécessaire ou erreur');
    }
    
    return corrected;
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return false;
  }
};

// Fonction pour créer des produits de test avec stock
const creerProduitsTest = () => {
  console.log('\n🧪 CRÉATION DE PRODUITS DE TEST:');
  
  const produitsTest = [
    {
      _id: 'test-fer-' + Date.now(),
      name: 'FER',
      description: 'Matériau de construction en fer',
      price: 300000,
      stock: 15,
      category: 'construction',
      productType: 'construction',
      images: ['test-image-1'],
      isPublished: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'test-ciment-' + Date.now(),
      name: 'CIMENT',
      description: 'Ciment de construction',
      price: 150000,
      stock: 20,
      category: 'construction',
      productType: 'construction',
      images: ['test-image-2'],
      isPublished: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'test-telephone-' + Date.now(),
      name: 'TÉLÉPHONE',
      description: 'Téléphone portable',
      price: 500000,
      stock: 8,
      category: 'electronics',
      productType: 'electronics',
      images: ['test-image-1'],
      isPublished: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  try {
    // Récupérer les produits existants
    let existingProducts = [];
    const data = localStorage.getItem('koula_products');
    if (data) {
      try {
        existingProducts = JSON.parse(data);
      } catch (error) {
        console.log('📦 Création d\'une nouvelle liste de produits');
      }
    }
    
    // Ajouter les produits de test
    existingProducts.push(...produitsTest);
    
    // Sauvegarder
    localStorage.setItem('koula_products', JSON.stringify(existingProducts));
    
    console.log('✅ Produits de test créés:');
    produitsTest.forEach(product => {
      console.log(`   📦 ${product.name} - Stock: ${product.stock} - Prix: ${product.price} GNF`);
    });
    
    console.log(`📦 Total produits: ${existingProducts.length}`);
    console.log('🔄 Rechargez la page pour voir les nouveaux produits');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour vérifier l'état après correction
const verifierApresCorrection = () => {
  console.log('\n🔍 VÉRIFICATION APRÈS CORRECTION:');
  
  try {
    const data = localStorage.getItem('koula_products');
    if (!data) {
      console.log('❌ Aucune donnée de produits');
      return;
    }
    
    const products = JSON.parse(data);
    const produitsAvecStock = products.filter(p => p.stock > 0);
    const produitsSansStock = products.filter(p => p.stock === 0 || !p.stock);
    
    console.log(`📦 Total produits: ${products.length}`);
    console.log(`✅ Produits avec stock: ${produitsAvecStock.length}`);
    console.log(`❌ Produits sans stock: ${produitsSansStock.length}`);
    
    if (produitsAvecStock.length > 0) {
      console.log('\n📋 Produits disponibles:');
      produitsAvecStock.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - Stock: ${product.stock} - Prix: ${product.price} GNF`);
      });
    }
    
    if (produitsSansStock.length > 0) {
      console.log('\n⚠️ Produits sans stock:');
      produitsSansStock.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - Stock: ${product.stock || 'Non défini'}`);
      });
    }
    
    return {
      total: products.length,
      avecStock: produitsAvecStock.length,
      sansStock: produitsSansStock.length
    };
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
};

// Fonction pour nettoyer et recréer les données
const nettoyerEtRecréer = () => {
  console.log('\n🧹 NETTOYAGE ET RECRÉATION:');
  
  try {
    // Nettoyer les données existantes
    localStorage.removeItem('koula_products');
    localStorage.removeItem('adminProducts');
    localStorage.removeItem('productsData');
    localStorage.removeItem('cartItems');
    
    console.log('✅ Données nettoyées');
    
    // Créer des produits de test
    const success = creerProduitsTest();
    
    if (success) {
      console.log('🎉 Système recréé avec succès!');
      console.log('🔄 Rechargez la page');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale de correction rapide
const correctionRapideComplète = () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION RAPIDE...');
  
  // 1. Correction du stock existant
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ CORRECTION DU STOCK EXISTANT');
  console.log('='.repeat(50));
  const stockCorrigé = corrigerStockRapide();
  
  // 2. Vérification après correction
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ VÉRIFICATION APRÈS CORRECTION');
  console.log('='.repeat(50));
  const état = verifierApresCorrection();
  
  // 3. Si aucun produit avec stock, créer des produits de test
  if (!état || état.avecStock === 0) {
    console.log('\n' + '='.repeat(50));
    console.log('3️⃣ CRÉATION DE PRODUITS DE TEST');
    console.log('='.repeat(50));
    creerProduitsTest();
  }
  
  // 4. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA CORRECTION');
  console.log('='.repeat(70));
  
  if (état) {
    console.log('🔍 Résultats:');
    console.log(`- Produits total: ${état.total}`);
    console.log(`- Produits avec stock: ${état.avecStock}`);
    console.log(`- Produits sans stock: ${état.sansStock}`);
    
    if (état.avecStock > 0) {
      console.log('\n🎉 SUCCÈS: Des produits avec stock sont disponibles!');
      console.log('✅ Les boutons "Ajouter au panier" ne devraient plus être grisés');
      console.log('🔄 Rechargez la page pour voir les changements');
    } else {
      console.log('\n❌ PROBLÈME: Aucun produit avec stock');
      console.log('💡 Utilisez nettoyerEtRecréer() pour repartir à zéro');
    }
  }
  
  console.log('\n💡 Instructions:');
  console.log('1. Rechargez la page');
  console.log('2. Vérifiez que les boutons ne sont plus grisés');
  console.log('3. Testez l\'ajout au panier');
  console.log('4. Si problème persiste, utilisez nettoyerEtRecréer()');
};

// Exporter les fonctions
window.corrigerStockRapide = corrigerStockRapide;
window.creerProduitsTest = creerProduitsTest;
window.verifierApresCorrection = verifierApresCorrection;
window.nettoyerEtRecréer = nettoyerEtRecréer;
window.correctionRapideComplète = correctionRapideComplète;

console.log('🔧 Fonctions disponibles:');
console.log('- corrigerStockRapide() : Corriger le stock de tous les produits');
console.log('- creerProduitsTest() : Créer des produits de test');
console.log('- verifierApresCorrection() : Vérifier l\'état après correction');
console.log('- nettoyerEtRecréer() : Nettoyer et recréer le système');
console.log('- correctionRapideComplète() : Correction complète');

// Exécuter automatiquement
correctionRapideComplète();
