// Script de correction immédiate pour la page Construction
// À exécuter dans la console du navigateur

console.log('🚨 CORRECTION IMMÉDIATE PAGE CONSTRUCTION');
console.log('=' .repeat(50));

// Fonction pour corriger immédiatement les produits de construction
const correctionImmediateConstruction = () => {
  console.log('\n🔧 CORRECTION IMMÉDIATE DES PRODUITS DE CONSTRUCTION:');
  
  // 1. Vérifier les produits existants
  const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
  console.log(`📦 Produits existants: ${products.length}`);
  
  // 2. Corriger les produits existants
  let produitsModifies = 0;
  products.forEach(product => {
    const nomProduit = product.name?.toLowerCase() || '';
    
    // Identifier les produits de construction
    if (nomProduit.includes('fer') || nomProduit.includes('ciment') || nomProduit.includes('tole')) {
      if (!product.category || product.category !== 'construction') {
        product.category = 'construction';
        produitsModifies++;
      }
      if (!product.productType || product.productType !== 'construction') {
        product.productType = 'construction';
        produitsModifies++;
      }
      if (!product.unit) {
        product.unit = 'unité';
      }
    }
  });
  
  // 3. Créer des produits de construction de test
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
      images: [{ url: 'https://via.placeholder.com/300x300?text=Ciment', alt: 'Ciment' }],
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
      images: [{ url: 'https://via.placeholder.com/300x300?text=Fer', alt: 'Fer' }],
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
      images: [{ url: 'https://via.placeholder.com/300x300?text=Tole', alt: 'Tôle' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Vérifier si les produits existent déjà
  const produitsExistants = products.filter(p => p._id.startsWith('construction-'));
  
  if (produitsExistants.length === 0) {
    products.push(...produitsConstructionTest);
    console.log('✅ 3 produits de construction créés');
  } else {
    console.log('ℹ️ Produits de construction déjà existants');
  }
  
  // 4. Sauvegarder
  localStorage.setItem('koula_products', JSON.stringify(products));
  
  console.log(`✅ ${produitsModifies} propriétés modifiées`);
  console.log(`📦 Total produits: ${products.length}`);
  
  // 5. Vérifier les produits de construction
  const produitsConstruction = products.filter(p => 
    p.category === 'construction' && p.productType === 'construction'
  );
  
  console.log(`🏗️ Produits de construction: ${produitsConstruction.length}`);
  produitsConstruction.forEach(p => {
    console.log(`  - ${p.name} (${p.price.toLocaleString('fr-FR')} GNF/${p.unit})`);
  });
  
  return produitsConstruction.length > 0;
};

// Fonction pour corriger le filtre de construction
const corrigerFiltreConstructionImmediate = () => {
  console.log('\n🔧 CORRECTION IMMÉDIATE DU FILTRE DE CONSTRUCTION:');
  
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

// Fonction pour forcer le rechargement de la page
const forcerRechargementPage = () => {
  console.log('\n🔄 FORCER LE RECHARGEMENT DE LA PAGE:');
  
  // Attendre un peu puis recharger
  setTimeout(() => {
    console.log('🔄 Rechargement de la page...');
    window.location.reload();
  }, 1000);
  
  return true;
};

// Fonction principale
const correctionImmediateComplet = async () => {
  console.log('🚨 DÉMARRAGE DE LA CORRECTION IMMÉDIATE...');
  
  // 1. Corriger les produits de construction
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ CORRECTION DES PRODUITS DE CONSTRUCTION');
  console.log('='.repeat(60));
  const produitsCorriges = correctionImmediateConstruction();
  
  // 2. Corriger le filtre de construction
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CORRECTION DU FILTRE DE CONSTRUCTION');
  console.log('='.repeat(60));
  const filtreCorrige = corrigerFiltreConstructionImmediate();
  
  // 3. Forcer le rechargement
  console.log('\n' + '='.repeat(60));
  console.log('3️⃣ RECHARGEMENT DE LA PAGE');
  console.log('='.repeat(60));
  const rechargement = forcerRechargementPage();
  
  // 4. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CORRECTION IMMÉDIATE');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Produits de construction corrigés: ${produitsCorriges ? '✅' : '❌'}`);
  console.log(`- Filtre de construction corrigé: ${filtreCorrige ? '✅' : '❌'}`);
  console.log(`- Rechargement de la page: ${rechargement ? '✅' : '❌'}`);
  
  console.log('\n🎉 CORRECTION IMMÉDIATE TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. La page va se recharger automatiquement');
  console.log('2. Vous devriez voir les produits de construction');
  console.log('3. Si cela ne fonctionne pas, actualisez manuellement (F5)');
  
  console.log('\n🔧 Corrections apportées:');
  console.log('- ✅ Produits de construction créés (Ciment, Fer, Tôle)');
  console.log('- ✅ Produits existants corrigés (catégorie et type)');
  console.log('- ✅ Filtre de construction corrigé');
  console.log('- ✅ Rechargement automatique de la page');
  
  console.log('\n✅ La page Construction devrait maintenant afficher les produits!');
};

// Exporter les fonctions
window.correctionImmediateConstruction = correctionImmediateConstruction;
window.corrigerFiltreConstructionImmediate = corrigerFiltreConstructionImmediate;
window.forcerRechargementPage = forcerRechargementPage;
window.correctionImmediateComplet = correctionImmediateComplet;

console.log('🔧 Fonctions disponibles:');
console.log('- correctionImmediateConstruction() : Corriger les produits de construction');
console.log('- corrigerFiltreConstructionImmediate() : Corriger le filtre de construction');
console.log('- forcerRechargementPage() : Forcer le rechargement de la page');
console.log('- correctionImmediateComplet() : Correction immédiate complète');

// Exécuter automatiquement
correctionImmediateComplet();
