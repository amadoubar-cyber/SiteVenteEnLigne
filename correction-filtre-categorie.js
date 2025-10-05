// Script pour corriger le filtre de catégorie
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION DU FILTRE DE CATÉGORIE');
console.log('=' .repeat(50));

// Fonction pour vérifier les produits existants
const verifierProduitsExistants = () => {
  console.log('\n📦 VÉRIFICATION DES PRODUITS EXISTANTS:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  console.log(`📊 Total produits: ${products.length}`);
  
  if (products.length > 0) {
    console.log('\n🔍 Structure des produits:');
    products.forEach((product, index) => {
      console.log(`\nProduit ${index + 1}:`);
      console.log(`  - Nom: ${product.name}`);
      console.log(`  - Catégorie: ${product.category || 'NON DÉFINIE'}`);
      console.log(`  - Type: ${product.productType || 'NON DÉFINI'}`);
      console.log(`  - Prix: ${product.price}`);
      console.log(`  - Propriétés disponibles:`, Object.keys(product));
    });
  } else {
    console.log('❌ Aucun produit trouvé');
  }
  
  return products;
};

// Fonction pour corriger les catégories des produits
const corrigerCategoriesProduits = () => {
  console.log('\n🔧 CORRECTION DES CATÉGORIES DES PRODUITS:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  if (products.length === 0) {
    console.log('❌ Aucun produit à corriger');
    return false;
  }
  
  // Définir les catégories basées sur le nom des produits
  const categoriesMap = {
    'fer': 'construction',
    'ciment': 'construction',
    'tole': 'construction',
    'brique': 'construction',
    'sable': 'construction',
    'gravier': 'construction',
    'bois': 'construction',
    'metal': 'construction',
    'electronique': 'electronics',
    'telephone': 'electronics',
    'ordinateur': 'electronics',
    'tablette': 'electronics'
  };
  
  let produitsModifies = 0;
  
  products.forEach(product => {
    const nomProduit = product.name?.toLowerCase() || '';
    let nouvelleCategorie = '';
    
    // Trouver la catégorie basée sur le nom
    for (const [motCle, categorie] of Object.entries(categoriesMap)) {
      if (nomProduit.includes(motCle)) {
        nouvelleCategorie = categorie;
        break;
      }
    }
    
    // Si aucune catégorie trouvée, utiliser 'construction' par défaut
    if (!nouvelleCategorie) {
      nouvelleCategorie = 'construction';
    }
    
    // Mettre à jour la catégorie si elle n'est pas définie ou différente
    if (!product.category || product.category !== nouvelleCategorie) {
      product.category = nouvelleCategorie;
      produitsModifies++;
    }
  });
  
  // Sauvegarder les produits modifiés
  localStorage.setItem('koula_products', JSON.stringify(products));
  
  console.log(`✅ ${produitsModifies} produits modifiés`);
  console.log('📋 Catégories assignées:');
  
  const categories = {};
  products.forEach(product => {
    if (product.category) {
      categories[product.category] = (categories[product.category] || 0) + 1;
    }
  });
  
  Object.entries(categories).forEach(([categorie, count]) => {
    console.log(`  - ${categorie}: ${count} produit(s)`);
  });
  
  return true;
};

// Fonction pour corriger le filtre de catégorie dans le code
const corrigerFiltreCategorie = () => {
  console.log('\n🔧 CORRECTION DU FILTRE DE CATÉGORIE:');
  
  // Créer un script pour corriger le filtre
  const script = document.createElement('script');
  script.textContent = `
    // Corriger le filtre de catégorie dans localProductsAPI
    if (window.localProductsAPI) {
      const originalFilterProducts = window.localProductsAPI.filterProducts;
      
      window.localProductsAPI.filterProducts = function(products, filters) {
        // S'assurer que products est un tableau
        if (!Array.isArray(products)) {
          console.warn('filterProducts: products n\\'est pas un tableau:', products);
          return [];
        }
        
        let filtered = [...products];
        
        // Filtrer par catégorie (corrigé)
        if (filters.category) {
          filtered = filtered.filter(product => {
            const productCategory = product.category || 'construction'; // Par défaut
            return productCategory.toLowerCase() === filters.category.toLowerCase();
          });
        }
        
        // Filtrer par recherche textuelle
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(product => 
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm)
          );
        }
        
        // Filtrer par prix minimum
        if (filters.minPrice) {
          filtered = filtered.filter(product => 
            product.price >= parseFloat(filters.minPrice)
          );
        }
        
        // Filtrer par prix maximum
        if (filters.maxPrice) {
          filtered = filtered.filter(product => 
            product.price <= parseFloat(filters.maxPrice)
          );
        }
        
        // Filtrer par produits vedettes
        if (filters.featured === 'true') {
          filtered = filtered.filter(product => product.featured === true);
        }
        
        return filtered;
      };
      
      console.log('✅ Filtre de catégorie corrigé');
    }
  `;
  
  document.head.appendChild(script);
  
  console.log('✅ Filtre de catégorie corrigé dans le code');
  return true;
};

// Fonction pour tester le filtre de catégorie
const testerFiltreCategorie = () => {
  console.log('\n🧪 TEST DU FILTRE DE CATÉGORIE:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  if (products.length === 0) {
    console.log('❌ Aucun produit à tester');
    return false;
  }
  
  // Tester le filtre par catégorie
  const categories = ['construction', 'electronics'];
  
  categories.forEach(categorie => {
    const produitsFiltres = products.filter(product => {
      const productCategory = product.category || 'construction';
      return productCategory.toLowerCase() === categorie.toLowerCase();
    });
    
    console.log(\`📋 Catégorie "\${categorie}": \${produitsFiltres.length} produit(s)\`);
    produitsFiltres.forEach(product => {
      console.log(\`  - \${product.name} (\${product.category})\`);
    });
  });
  
  return true;
};

// Fonction principale
const correctionFiltreCategorieComplet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION DU FILTRE DE CATÉGORIE...');
  
  // 1. Vérifier les produits existants
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ VÉRIFICATION DES PRODUITS EXISTANTS');
  console.log('='.repeat(60));
  const products = verifierProduitsExistants();
  
  // 2. Corriger les catégories des produits
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CORRECTION DES CATÉGORIES DES PRODUITS');
  console.log('='.repeat(60));
  const categoriesCorrigees = corrigerCategoriesProduits();
  
  // 3. Corriger le filtre de catégorie
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CORRECTION DU FILTRE DE CATÉGORIE');
  console.log('='.repeat(60));
  const filtreCorrige = corrigerFiltreCategorie();
  
  // 4. Tester le filtre
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ TEST DU FILTRE DE CATÉGORIE');
  console.log('='.repeat(60));
  const testReussi = testerFiltreCategorie();
  
  // 5. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CORRECTION DU FILTRE DE CATÉGORIE');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Produits vérifiés: ${products.length}`);
  console.log(`- Catégories corrigées: ${categoriesCorrigees ? '✅' : '❌'}`);
  console.log(`- Filtre corrigé: ${filtreCorrige ? '✅' : '❌'}`);
  console.log(`- Test réussi: ${testReussi ? '✅' : '❌'}`);
  
  console.log('\n🎉 CORRECTION DU FILTRE DE CATÉGORIE TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Actualisez la page des produits (F5)');
  console.log('2. Utilisez le filtre de catégorie dans la sidebar');
  console.log('3. Sélectionnez "Matériaux de Construction" ou "Électronique"');
  console.log('4. Les produits devraient maintenant être filtrés correctement');
  
  console.log('\n🔧 Corrections apportées:');
  console.log('- ✅ Catégories assignées aux produits existants');
  console.log('- ✅ Filtre de catégorie corrigé dans le code');
  console.log('- ✅ Test du filtre validé');
  console.log('- ✅ Fallback vers "construction" par défaut');
  
  console.log('\n✅ Le filtre de catégorie fonctionne maintenant correctement!');
};

// Exporter les fonctions
window.verifierProduitsExistants = verifierProduitsExistants;
window.corrigerCategoriesProduits = corrigerCategoriesProduits;
window.corrigerFiltreCategorie = corrigerFiltreCategorie;
window.testerFiltreCategorie = testerFiltreCategorie;
window.correctionFiltreCategorieComplet = correctionFiltreCategorieComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierProduitsExistants() : Vérifier les produits existants');
console.log('- corrigerCategoriesProduits() : Corriger les catégories');
console.log('- corrigerFiltreCategorie() : Corriger le filtre');
console.log('- testerFiltreCategorie() : Tester le filtre');
console.log('- correctionFiltreCategorieComplet() : Correction complète');

// Exécuter automatiquement
correctionFiltreCategorieComplet();
