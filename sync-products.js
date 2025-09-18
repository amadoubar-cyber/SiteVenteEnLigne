const fs = require('fs');
const path = require('path');

// Images de test encodées en base64
const TEST_IMAGES = {
  'test-image-1': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzYwQTVGQSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAxPC90ZXh0Pgo8L3N2Zz4K',
  'test-image-2': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM0RDM5OSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAyPC90ZXh0Pgo8L3N2Zz4K',
  'placeholder': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0NDQ0NDQyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QQVMgRCdJTUFHRTwvdGV4dD4KPC9zdmc+Cg=='
};

// Produits de test avec images base64
const testProducts = [
  {
    _id: '1',
    name: 'Ciment Portland 50kg',
    description: 'Ciment de haute qualité pour construction',
    price: 45000,
    category: 'matériau',
    productType: 'matériau',
    brand: 'Dangote',
    stock: 100,
    isPublished: true,
    isFeatured: true,
    images: [TEST_IMAGES['test-image-1']],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Téléphone Samsung Galaxy A54',
    description: 'Smartphone Android avec écran 6.4"',
    price: 450000,
    category: 'électronique',
    productType: 'électronique',
    brand: 'Samsung',
    stock: 25,
    isPublished: true,
    isFeatured: true,
    images: [TEST_IMAGES['test-image-2']],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Tuyau PVC 100mm',
    description: 'Tuyau en PVC pour canalisation',
    price: 15000,
    category: 'matériau',
    productType: 'matériau',
    brand: 'Aqua',
    stock: 50,
    isPublished: true,
    isFeatured: false,
    images: [TEST_IMAGES['test-image-1']],
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Laptop HP Pavilion',
    description: 'Ordinateur portable 15.6" Intel i5',
    price: 650000,
    category: 'électronique',
    productType: 'électronique',
    brand: 'HP',
    stock: 15,
    isPublished: true,
    isFeatured: false,
    images: [TEST_IMAGES['test-image-2']],
    createdAt: new Date().toISOString()
  }
];

// Fonction pour synchroniser les produits
function syncProducts() {
  try {
    // Créer le dossier public s'il n'existe pas
    const publicDir = path.join(__dirname, 'client', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Filtrer les produits publiés
    const publishedProducts = testProducts.filter(product => product.isPublished);

    // Écrire les produits dans le fichier JSON
    const productsData = {
      products: publishedProducts,
      total: publishedProducts.length,
      lastUpdated: new Date().toISOString()
    };

    const outputPath = path.join(publicDir, 'products-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(productsData, null, 2));

    console.log('✅ Produits synchronisés avec succès !');
    console.log(`📁 Fichier créé : ${outputPath}`);
    console.log(`📊 ${publishedProducts.length} produits publiés synchronisés`);
    
    // Afficher les produits synchronisés
    publishedProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.productType}) - ${product.isFeatured ? '⭐ Vedette' : '📝 Normal'}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation :', error.message);
  }
}

// Exécuter la synchronisation
syncProducts();