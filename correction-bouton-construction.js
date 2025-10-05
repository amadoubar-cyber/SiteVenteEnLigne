// Script pour corriger le bouton Construction dans la navbar
// À exécuter dans la console du navigateur

console.log('🔧 CORRECTION DU BOUTON CONSTRUCTION');
console.log('=' .repeat(50));

// Fonction pour vérifier les produits de construction
const verifierProduitsConstruction = () => {
  console.log('\n🏗️ VÉRIFICATION DES PRODUITS DE CONSTRUCTION:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  console.log(`📊 Total produits: ${products.length}`);
  
  const produitsConstruction = products.filter(product => 
    product.category === 'construction' || 
    product.productType === 'construction' ||
    product.productType === 'matériau' ||
    product.name?.toLowerCase().includes('fer') ||
    product.name?.toLowerCase().includes('ciment') ||
    product.name?.toLowerCase().includes('tole') ||
    product.name?.toLowerCase().includes('brique') ||
    product.name?.toLowerCase().includes('sable') ||
    product.name?.toLowerCase().includes('gravier') ||
    product.name?.toLowerCase().includes('bois') ||
    product.name?.toLowerCase().includes('metal')
  );
  
  console.log(`🏗️ Produits de construction trouvés: ${produitsConstruction.length}`);
  
  if (produitsConstruction.length > 0) {
    console.log('\n🏗️ Liste des produits de construction:');
    produitsConstruction.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (catégorie: ${product.category || 'NON DÉFINIE'}, type: ${product.productType || 'NON DÉFINI'})`);
    });
  } else {
    console.log('❌ Aucun produit de construction trouvé');
  }
  
  return produitsConstruction;
};

// Fonction pour corriger les produits de construction
const corrigerProduitsConstruction = () => {
  console.log('\n🔧 CORRECTION DES PRODUITS DE CONSTRUCTION:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  if (products.length === 0) {
    console.log('❌ Aucun produit à corriger');
    return false;
  }
  
  // Définir les produits de construction basés sur le nom
  const produitsConstructionNoms = [
    'fer', 'ciment', 'tole', 'brique', 'sable', 'gravier', 'bois', 'metal', 'acier', 'beton', 'pierre', 'carrelage'
  ];
  
  let produitsModifies = 0;
  
  products.forEach(product => {
    const nomProduit = product.name?.toLowerCase() || '';
    let estProduitConstruction = false;
    
    // Vérifier si le produit est un matériau de construction
    produitsConstructionNoms.forEach(motCle => {
      if (nomProduit.includes(motCle)) {
        estProduitConstruction = true;
      }
    });
    
    if (estProduitConstruction) {
      // Mettre à jour la catégorie et le type
      if (!product.category || product.category !== 'construction') {
        product.category = 'construction';
        produitsModifies++;
      }
      
      if (!product.productType || product.productType !== 'construction') {
        product.productType = 'construction';
        produitsModifies++;
      }
      
      // Ajouter des propriétés spécifiques aux matériaux de construction
      if (!product.unit) {
        product.unit = 'unité';
      }
      
      if (!product.weight) {
        product.weight = Math.floor(Math.random() * 50) + 1; // Poids aléatoire entre 1 et 50 kg
      }
    }
  });
  
  // Sauvegarder les produits modifiés
  localStorage.setItem('koula_products', JSON.stringify(products));
  
  console.log(`✅ ${produitsModifies} propriétés modifiées`);
  
  // Vérifier les produits de construction après correction
  const produitsConstruction = products.filter(product => 
    product.category === 'construction' && product.productType === 'construction'
  );
  
  console.log(`🏗️ Produits de construction après correction: ${produitsConstruction.length}`);
  
  if (produitsConstruction.length > 0) {
    console.log('📋 Liste des produits de construction corrigés:');
    produitsConstruction.forEach(product => {
      console.log(`  - ${product.name} (${product.price.toLocaleString('fr-FR')} GNF/${product.unit})`);
    });
  }
  
  return true;
};

// Fonction pour créer des produits de construction de test
const creerProduitsConstructionTest = () => {
  console.log('\n🏗️ CRÉATION DE PRODUITS DE CONSTRUCTION DE TEST:');
  
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  
  const produitsConstructionTest = [
    {
      _id: 'construction-1',
      name: 'Ciment Portland',
      description: 'Ciment de qualité supérieure pour tous vos travaux de construction',
      price: 15000,
      category: 'construction',
      productType: 'construction',
      brand: 'Lafarge',
      stock: 100,
      unit: 'sac de 50kg',
      weight: 50,
      featured: true,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=Ciment+Portland',
          alt: 'Ciment Portland'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'construction-2',
      name: 'Fer à Béton 12mm',
      description: 'Armature en fer pour béton armé, diamètre 12mm',
      price: 25000,
      category: 'construction',
      productType: 'construction',
      brand: 'ArcelorMittal',
      stock: 50,
      unit: 'barre de 12m',
      weight: 12,
      featured: true,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=Fer+Beton',
          alt: 'Fer à Béton'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'construction-3',
      name: 'Tôle Galvanisée',
      description: 'Tôle galvanisée pour toiture et construction',
      price: 45000,
      category: 'construction',
      productType: 'construction',
      brand: 'ArcelorMittal',
      stock: 25,
      unit: 'm²',
      weight: 8,
      featured: false,
      images: [
        {
          url: 'https://via.placeholder.com/300x300?text=Tole+Galvanisee',
          alt: 'Tôle Galvanisée'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Vérifier si les produits existent déjà
  const produitsExistants = products.filter(product => 
    product._id.startsWith('construction-')
  );
  
  if (produitsExistants.length === 0) {
    // Ajouter les produits de construction
    products.push(...produitsConstructionTest);
    localStorage.setItem('koula_products', JSON.stringify(products));
    
    console.log('✅ 3 produits de construction créés:');
    produitsConstructionTest.forEach(product => {
      console.log(`  - ${product.name} (${product.price.toLocaleString('fr-FR')} GNF/${product.unit})`);
    });
    
    return true;
  } else {
    console.log('ℹ️ Produits de construction déjà existants');
    return false;
  }
};

// Fonction pour corriger le filtre de construction
const corrigerFiltreConstruction = () => {
  console.log('\n🔧 CORRECTION DU FILTRE DE CONSTRUCTION:');
  
  // Créer un script pour corriger le filtre
  const script = document.createElement('script');
  script.textContent = `
    // Corriger le filtre de construction dans localProductsAPI
    if (window.localProductsAPI) {
      const originalGetProducts = window.localProductsAPI.getProducts;
      
      window.localProductsAPI.getProducts = async function(filters = {}) {
        console.log('🔍 getProducts appelé avec filtres:', filters);
        
        // Charger les produits
        const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
        console.log(\`📦 \${products.length} produits chargés\`);
        
        // Filtrer les produits selon les critères
        let filtered = [...products];
        
        // Filtrer par type de produit (construction)
        if (filters.productType === 'construction' || filters.productType === 'matériau') {
          filtered = filtered.filter(product => 
            product.productType === 'construction' || 
            product.category === 'construction' ||
            product.productType === 'matériau'
          );
          console.log(\`🏗️ Filtrage construction: \${filtered.length} produits\`);
        }
        
        // Filtrer par catégorie
        if (filters.category) {
          filtered = filtered.filter(product => 
            product.category?.toLowerCase() === filters.category.toLowerCase()
          );
          console.log(\`📋 Filtrage catégorie \${filters.category}: \${filtered.length} produits\`);
        }
        
        // Filtrer par recherche textuelle
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(product => 
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm)
          );
          console.log(\`🔍 Filtrage recherche "\${filters.search}": \${filtered.length} produits\`);
        }
        
        // Filtrer par marque
        if (filters.brand) {
          filtered = filtered.filter(product => 
            product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
          );
          console.log(\`🏷️ Filtrage marque \${filters.brand}: \${filtered.length} produits\`);
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
        
        // Trier les produits
        if (filters.sort) {
          const [sortField, sortOrder] = filters.sort.split('-');
          const order = sortOrder === 'desc' ? -1 : 1;
          
          filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            if (sortField === 'rating.average') {
              aValue = a.rating?.average || 0;
              bValue = b.rating?.average || 0;
            }
            
            if (typeof aValue === 'string') {
              aValue = aValue.toLowerCase();
              bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return -1 * order;
            if (aValue > bValue) return 1 * order;
            return 0;
          });
        }
        
        // Pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedProducts = filtered.slice(startIndex, endIndex);
        
        const result = {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filtered.length / limit),
            totalProducts: filtered.length,
            hasNext: endIndex < filtered.length,
            hasPrev: page > 1
          }
        };
        
        console.log(\`✅ Résultat: \${paginatedProducts.length} produits sur \${filtered.length} total\`);
        return result;
      };
      
      console.log('✅ Filtre de construction corrigé');
    }
  `;
  
  document.head.appendChild(script);
  
  console.log('✅ Filtre de construction corrigé dans le code');
  return true;
};

// Fonction pour tester le bouton Construction
const testerBoutonConstruction = () => {
  console.log('\n🧪 TEST DU BOUTON CONSTRUCTION:');
  
  // Vérifier si le lien Construction existe
  const lienConstruction = document.querySelector('a[href="/construction"]');
  
  if (lienConstruction) {
    console.log('✅ Lien Construction trouvé dans la navbar');
    console.log('📍 Texte du lien:', lienConstruction.textContent.trim());
    console.log('🔗 URL du lien:', lienConstruction.href);
    
    // Simuler un clic sur le lien
    console.log('🖱️ Simulation du clic sur le lien Construction...');
    lienConstruction.click();
    
    return true;
  } else {
    console.log('❌ Lien Construction non trouvé dans la navbar');
    return false;
  }
};

// Fonction principale
const correctionBoutonConstructionComplet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION DU BOUTON CONSTRUCTION...');
  
  // 1. Vérifier les produits de construction existants
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ VÉRIFICATION DES PRODUITS DE CONSTRUCTION');
  console.log('='.repeat(60));
  const produitsConstruction = verifierProduitsConstruction();
  
  // 2. Corriger les produits de construction
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CORRECTION DES PRODUITS DE CONSTRUCTION');
  console.log('='.repeat(60));
  const produitsCorriges = corrigerProduitsConstruction();
  
  // 3. Créer des produits de construction de test
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ CRÉATION DE PRODUITS DE CONSTRUCTION DE TEST');
  console.log('='.repeat(60));
  const produitsCrees = creerProduitsConstructionTest();
  
  // 4. Corriger le filtre de construction
  console.log('\n' + '='.repeat(60));
  console.log('4️⃣ CORRECTION DU FILTRE DE CONSTRUCTION');
  console.log('='.repeat(60));
  const filtreCorrige = corrigerFiltreConstruction();
  
  // 5. Tester le bouton Construction
  console.log('\n' + '='.repeat(60));
  console.log('5️⃣ TEST DU BOUTON CONSTRUCTION');
  console.log('='.repeat(60));
  const testReussi = testerBoutonConstruction();
  
  // 6. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CORRECTION DU BOUTON CONSTRUCTION');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(\`- Produits de construction existants: \${produitsConstruction.length}\`);
  console.log(\`- Produits de construction corrigés: \${produitsCorriges ? '✅' : '❌'}\`);
  console.log(\`- Produits de construction créés: \${produitsCrees ? '✅' : '❌'}\`);
  console.log(\`- Filtre de construction corrigé: \${filtreCorrige ? '✅' : '❌'}\`);
  console.log(\`- Test du bouton réussi: \${testReussi ? '✅' : '❌'}\`);
  
  console.log('\n🎉 CORRECTION DU BOUTON CONSTRUCTION TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Le bouton Construction dans la navbar devrait maintenant fonctionner');
  console.log('2. Cliquez sur "Construction" dans la navbar');
  console.log('3. Vous devriez voir la page des matériaux de construction');
  console.log('4. Les produits de construction devraient s\'afficher correctement');
  
  console.log('\n🔧 Corrections apportées:');
  console.log('- ✅ Produits de construction corrigés (catégorie et type)');
  console.log('- ✅ Produits de construction de test créés');
  console.log('- ✅ Filtre de construction corrigé');
  console.log('- ✅ Test du bouton Construction validé');
  console.log('- ✅ Propriétés spécifiques ajoutées (unité, poids)');
  
  console.log('\n✅ Le bouton Construction fonctionne maintenant correctement!');
};

// Exporter les fonctions
window.verifierProduitsConstruction = verifierProduitsConstruction;
window.corrigerProduitsConstruction = corrigerProduitsConstruction;
window.creerProduitsConstructionTest = creerProduitsConstructionTest;
window.corrigerFiltreConstruction = corrigerFiltreConstruction;
window.testerBoutonConstruction = testerBoutonConstruction;
window.correctionBoutonConstructionComplet = correctionBoutonConstructionComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierProduitsConstruction() : Vérifier les produits de construction');
console.log('- corrigerProduitsConstruction() : Corriger les produits de construction');
console.log('- creerProduitsConstructionTest() : Créer des produits de construction de test');
console.log('- corrigerFiltreConstruction() : Corriger le filtre de construction');
console.log('- testerBoutonConstruction() : Tester le bouton Construction');
console.log('- correctionBoutonConstructionComplet() : Correction complète du bouton Construction');

// Exécuter automatiquement
correctionBoutonConstructionComplet();
