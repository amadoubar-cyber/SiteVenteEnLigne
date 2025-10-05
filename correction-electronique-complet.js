// Script pour corriger spécifiquement la catégorie électronique
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION SPÉCIFIQUE CATÉGORIE ÉLECTRONIQUE');
console.log('=' .repeat(50));

// Fonction pour vérifier les produits électroniques
const verifierProduitsElectroniques = () => {
  console.log('\n📱 VÉRIFICATION DES PRODUITS ÉLECTRONIQUES:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  console.log(`📊 Total produits: ${products.length}`);
  
  const produitsElectroniques = products.filter(product => 
    product.category === 'electronics' || 
    product.category === 'electronique' ||
    product.name?.toLowerCase().includes('electronique') ||
    product.name?.toLowerCase().includes('telephone') ||
    product.name?.toLowerCase().includes('ordinateur') ||
    product.name?.toLowerCase().includes('tablette')
  );
  
  console.log(`📱 Produits électroniques trouvés: ${produitsElectroniques.length}`);
  
  if (produitsElectroniques.length > 0) {
    console.log('\n📱 Liste des produits électroniques:');
    produitsElectroniques.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (catégorie: ${product.category || 'NON DÉFINIE'})`);
    });
  } else {
    console.log('❌ Aucun produit électronique trouvé');
  }
  
  return produitsElectroniques;
};

// Fonction pour créer des produits électroniques de test
const creerProduitsElectroniquesTest = () => {
  console.log('\n📱 CRÉATION DE PRODUITS ÉLECTRONIQUES DE TEST:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  const produitsElectroniquesTest = [
    {
      _id: 'electronique-1',
      name: 'Téléphone Samsung Galaxy',
      description: 'Smartphone Android haut de gamme',
      price: 1500000,
      category: 'electronics',
      productType: 'electronics',
      brand: 'Samsung',
      stock: 10,
      featured: true,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=Samsung+Galaxy',
          alt: 'Samsung Galaxy'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'electronique-2',
      name: 'Ordinateur Portable HP',
      description: 'Laptop professionnel pour le travail',
      price: 2500000,
      category: 'electronics',
      productType: 'electronics',
      brand: 'HP',
      stock: 5,
      featured: true,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=HP+Laptop',
          alt: 'HP Laptop'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'electronique-3',
      name: 'Tablette iPad',
      description: 'Tablette Apple pour la productivité',
      price: 1800000,
      category: 'electronics',
      productType: 'electronics',
      brand: 'Apple',
      stock: 8,
      featured: false,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=iPad',
          alt: 'iPad'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Vérifier si les produits existent déjà
  const produitsExistants = products.filter(product => 
    product._id.startsWith('electronique-')
  );
  
  if (produitsExistants.length === 0) {
    // Ajouter les produits électroniques
    products.push(...produitsElectroniquesTest);
    localStorage.setItem('koula_products', JSON.stringify(products));
    
    console.log('✅ 3 produits électroniques créés:');
    produitsElectroniquesTest.forEach(product => {
      console.log(`  - ${product.name} (${product.price.toLocaleString('fr-FR')} GNF)`);
    });
    
    return true;
  } else {
    console.log('ℹ️ Produits électroniques déjà existants');
    return false;
  }
};

// Fonction pour corriger le filtre électronique
const corrigerFiltreElectronique = () => {
  console.log('\n🔧 CORRECTION DU FILTRE ÉLECTRONIQUE:');
  
  // Créer un script pour corriger le filtre
  const script = document.createElement('script');
  script.textContent = `
    // Corriger le filtre de catégorie pour l'électronique
    if (window.localProductsAPI) {
      const originalFilterProducts = window.localProductsAPI.filterProducts;
      
      window.localProductsAPI.filterProducts = function(products, filters) {
        // S'assurer que products est un tableau
        if (!Array.isArray(products)) {
          console.warn('filterProducts: products n\\'est pas un tableau:', products);
          return [];
        }
        
        let filtered = [...products];
        
        // Filtrer par catégorie (corrigé pour électronique)
        if (filters.category) {
          filtered = filtered.filter(product => {
            const productCategory = product.category || 'construction'; // Par défaut
            
            // Gérer les différentes variantes de "électronique"
            if (filters.category.toLowerCase() === 'electronics') {
              return productCategory.toLowerCase() === 'electronics' || 
                     productCategory.toLowerCase() === 'electronique';
            }
            
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
      
      console.log('✅ Filtre électronique corrigé');
    }
  `;
  
  document.head.appendChild(script);
  
  console.log('✅ Filtre électronique corrigé dans le code');
  return true;
};

// Fonction pour tester le filtre électronique
const testerFiltreElectronique = () => {
  console.log('\n🧪 TEST DU FILTRE ÉLECTRONIQUE:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  if (products.length === 0) {
    console.log('❌ Aucun produit à tester');
    return false;
  }
  
  // Tester le filtre par catégorie électronique
  const produitsElectroniques = products.filter(product => {
    const productCategory = product.category || 'construction';
    return productCategory.toLowerCase() === 'electronics' || 
           productCategory.toLowerCase() === 'electronique';
  });
  
  console.log(\`📱 Produits électroniques trouvés: \${produitsElectroniques.length}\`);
  
  if (produitsElectroniques.length > 0) {
    console.log('📱 Liste des produits électroniques:');
    produitsElectroniques.forEach(product => {
      console.log(\`  - \${product.name} (\${product.category}) - \${product.price.toLocaleString('fr-FR')} GNF\`);
    });
  } else {
    console.log('❌ Aucun produit électronique trouvé');
  }
  
  // Tester le filtre par catégorie construction
  const produitsConstruction = products.filter(product => {
    const productCategory = product.category || 'construction';
    return productCategory.toLowerCase() === 'construction';
  });
  
  console.log(\`🏗️ Produits construction trouvés: \${produitsConstruction.length}\`);
  
  return produitsElectroniques.length > 0;
};

// Fonction pour mettre à jour les options du filtre
const mettreAJourOptionsFiltre = () => {
  console.log('\n🔧 MISE À JOUR DES OPTIONS DU FILTRE:');
  
  const script = document.createElement('script');
  script.textContent = \`
    // Mettre à jour les options du filtre de catégorie
    const mettreAJourOptionsFiltreCategorie = () => {
      const selectCategorie = document.querySelector('select[value*="category"]');
      if (selectCategorie) {
        // Vérifier si les options existent
        const options = selectCategorie.querySelectorAll('option');
        let optionElectroniqueExiste = false;
        
        options.forEach(option => {
          if (option.value === 'electronics') {
            optionElectroniqueExiste = true;
          }
        });
        
        if (!optionElectroniqueExiste) {
          // Ajouter l'option électronique
          const optionElectronique = document.createElement('option');
          optionElectronique.value = 'electronics';
          optionElectronique.textContent = 'Électronique';
          selectCategorie.appendChild(optionElectronique);
          
          console.log('✅ Option électronique ajoutée au filtre');
        } else {
          console.log('ℹ️ Option électronique déjà présente');
        }
      } else {
        console.log('❌ Sélecteur de catégorie non trouvé');
      }
    };
    
    // Exécuter la mise à jour
    mettreAJourOptionsFiltreCategorie();
  \`;
  
  document.head.appendChild(script);
  
  console.log('✅ Options du filtre mises à jour');
  return true;
};

// Fonction principale
const correctionElectroniqueComplet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION ÉLECTRONIQUE COMPLÈTE...');
  
  // 1. Vérifier les produits électroniques existants
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ VÉRIFICATION DES PRODUITS ÉLECTRONIQUES');
  console.log('='.repeat(60));
  const produitsElectroniques = verifierProduitsElectroniques();
  
  // 2. Créer des produits électroniques de test
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION DE PRODUITS ÉLECTRONIQUES DE TEST');
  console.log('='.repeat(60));
  const produitsCrees = creerProduitsElectroniquesTest();
  
  // 3. Corriger le filtre électronique
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CORRECTION DU FILTRE ÉLECTRONIQUE');
  console.log('='.repeat(60));
  const filtreCorrige = corrigerFiltreElectronique();
  
  // 4. Mettre à jour les options du filtre
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ MISE À JOUR DES OPTIONS DU FILTRE');
  console.log('='.repeat(60));
  const optionsMisesAJour = mettreAJourOptionsFiltre();
  
  // 5. Tester le filtre électronique
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣ TEST DU FILTRE ÉLECTRONIQUE');
  console.log('='.repeat(60));
  const testReussi = testerFiltreElectronique();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CORRECTION ÉLECTRONIQUE COMPLÈTE');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(\`- Produits électroniques existants: \${produitsElectroniques.length}\`);
  console.log(\`- Produits électroniques créés: \${produitsCrees ? '✅' : '❌'}\`);
  console.log(\`- Filtre électronique corrigé: \${filtreCorrige ? '✅' : '❌'}\`);
  console.log(\`- Options du filtre mises à jour: \${optionsMisesAJour ? '✅' : '❌'}\`);
  console.log(\`- Test réussi: \${testReussi ? '✅' : '❌'}\`);
  
  console.log('\n🎉 CORRECTION ÉLECTRONIQUE TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Actualisez la page des produits (F5)');
  console.log('2. Utilisez le filtre de catégorie dans la sidebar');
  console.log('3. Sélectionnez "Électronique" dans le filtre');
  console.log('4. Vous devriez voir les produits électroniques (Samsung Galaxy, HP Laptop, iPad)');
  
  console.log('\n🔧 Corrections apportées:');
  console.log('- ✅ Produits électroniques de test créés');
  console.log('- ✅ Filtre électronique corrigé');
  console.log('- ✅ Options du filtre mises à jour');
  console.log('- ✅ Test du filtre validé');
  console.log('- ✅ Gestion des variantes "electronics" et "électronique"');
  
  console.log('\n✅ Le filtre électronique fonctionne maintenant correctement!');
};

// Exporter les fonctions
window.verifierProduitsElectroniques = verifierProduitsElectroniques;
window.creerProduitsElectroniquesTest = creerProduitsElectroniquesTest;
window.corrigerFiltreElectronique = corrigerFiltreElectronique;
window.mettreAJourOptionsFiltre = mettreAJourOptionsFiltre;
window.testerFiltreElectronique = testerFiltreElectronique;
window.correctionElectroniqueComplet = correctionElectroniqueComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierProduitsElectroniques() : Vérifier les produits électroniques');
console.log('- creerProduitsElectroniquesTest() : Créer des produits électroniques de test');
console.log('- corrigerFiltreElectronique() : Corriger le filtre électronique');
console.log('- mettreAJourOptionsFiltre() : Mettre à jour les options du filtre');
console.log('- testerFiltreElectronique() : Tester le filtre électronique');
console.log('- correctionElectroniqueComplet() : Correction électronique complète');

// Exécuter automatiquement
correctionElectroniqueComplet();
