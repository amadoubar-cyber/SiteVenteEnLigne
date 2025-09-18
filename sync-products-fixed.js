const fs = require('fs');
const path = require('path');

// Images de test encodées en base64 (doivent correspondre à celles dans imageUtils.js)
const TEST_IMAGES = {
  'test-image-1': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzYwQTVGQSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAxPC90ZXh0Pgo8L3N2Zz4K',
  'test-image-2': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM0RDM5OSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAyPC90ZXh0Pgo8L3N2Zz4K',
  'placeholder': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0NDQ0NDQyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QQVMgRCdJTUFHRTwvdGV4dD4KPC9zdmc+Cg=='
};

// Simuler localStorage pour le script Node.js
const localStorage = {
  getItem: (key) => {
    try {
      // Lire le contenu du fichier adminProducts.json
      const filePath = path.join(__dirname, 'client', 'public', 'adminProducts.json');
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de adminProducts.json:', error);
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      // Écrire le contenu dans le fichier adminProducts.json
      const filePath = path.join(__dirname, 'client', 'public', 'adminProducts.json');
      fs.writeFileSync(filePath, value, 'utf8');
    } catch (error) {
      console.error('Erreur lors de l\'écriture de adminProducts.json:', error);
    }
  }
};

function getImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return TEST_IMAGES.placeholder;
  }
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  if (imageUrl.includes('test-image-1')) {
    return TEST_IMAGES['test-image-1'];
  }
  if (imageUrl.includes('test-image-2')) {
    return TEST_IMAGES['test-image-2'];
  }
  // Fallback pour les images /uploads si le serveur n'est pas là
  if (imageUrl.startsWith('/uploads')) {
    const fileName = imageUrl.split('/').pop();
    if (fileName.includes('1')) {
      return TEST_IMAGES['test-image-1'];
    } else if (fileName.includes('2')) {
      return TEST_IMAGES['test-image-2'];
    }
    return TEST_IMAGES['test-image-1']; // Default test image
  }
  return imageUrl; // Should not happen with current setup
}

function getProductImage(product) {
  if (!product) return TEST_IMAGES.placeholder;
  if (typeof product.image === 'string') {
    return getImageUrl(product.image);
  }
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return getImageUrl(firstImage);
    }
    if (firstImage && typeof firstImage === 'object' && firstImage.url) {
      return getImageUrl(firstImage.url);
    }
  }
  if (product.imageUrl) {
    return getImageUrl(product.imageUrl);
  }
  return TEST_IMAGES.placeholder;
}

const syncProducts = () => {
  console.log('🔄 Synchronisation des produits...');
  
  const productsJSON = localStorage.getItem('adminProducts');
  let products = [];

  if (productsJSON) {
    try {
      products = JSON.parse(productsJSON);
      console.log(`📦 ${products.length} produits trouvés dans adminProducts.json`);
    } catch (error) {
      console.error('❌ Erreur lors du parsing de adminProducts.json:', error);
      return;
    }
  } else {
    console.log("⚠️ Aucun produit trouvé dans adminProducts.json. Création de produits de test...");
    
    // Initialiser avec des produits de test si localStorage est vide
    products = [
      {
        _id: '1758210447762',
        name: 'Ciment Portland 50kg',
        description: 'Ciment de haute qualité pour tous types de construction.',
        price: 75000,
        category: 'Matériaux de construction',
        productType: 'matériau',
        brand: 'CIMAF',
        stock: 150,
        images: [{ url: getProductImage({ imageUrl: '/uploads/ciment.jpg' }) }],
        isPublished: true,
        isFeatured: true,
        reviews: [],
        rating: 4.5,
        numReviews: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '1758210447763',
        name: 'Téléphone Samsung Galaxy A54',
        description: 'Smartphone performant avec un excellent appareil photo.',
        price: 3500000,
        category: 'Téléphones',
        productType: 'électronique',
        brand: 'Samsung',
        stock: 75,
        images: [{ url: getProductImage({ imageUrl: '/uploads/samsung-a54.jpg' }) }],
        isPublished: true,
        isFeatured: true,
        reviews: [],
        rating: 4.7,
        numReviews: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '1758210447764',
        name: 'Tuyau PVC 100mm',
        description: 'Tuyau en PVC résistant pour l\'adduction d\'eau.',
        price: 15000,
        category: 'Plomberie',
        productType: 'matériau',
        brand: 'Plasto',
        stock: 200,
        images: [{ url: getProductImage({ imageUrl: '/uploads/tuyau-pvc.jpg' }) }],
        isPublished: true,
        isFeatured: false,
        reviews: [],
        rating: 4.0,
        numReviews: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '1758210447765',
        name: 'Laptop HP Pavilion',
        description: 'Ordinateur portable polyvalent pour le travail et le divertissement.',
        price: 7000000,
        category: 'Ordinateurs',
        productType: 'électronique',
        brand: 'HP',
        stock: 30,
        images: [{ url: getProductImage({ imageUrl: '/uploads/hp-pavilion.jpg' }) }],
        isPublished: true,
        isFeatured: false,
        reviews: [],
        rating: 4.6,
        numReviews: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    // Sauvegarder les produits de test
    localStorage.setItem('adminProducts', JSON.stringify(products));
    console.log('✅ Produits de test créés et sauvegardés');
  }

  const publishedProducts = products.filter(p => p.isPublished);
  console.log(`📊 ${publishedProducts.length} produits publiés trouvés`);

  // Assurez-vous que chaque produit a une image valide
  const productsWithValidImages = publishedProducts.map(product => {
    const imageUrl = getProductImage(product);
    return {
      ...product,
      images: [{ url: imageUrl }], // Assurez-vous que c'est un tableau d'objets
      imageUrl: imageUrl // Pour la compatibilité avec d'autres parties du code
    };
  });

  const outputPath = path.join(__dirname, 'client', 'public', 'products-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(productsWithValidImages, null, 2), 'utf8');

  console.log('✅ Produits synchronisés avec succès !');
  console.log(`📁 Fichier créé : ${outputPath}`);
  console.log(`📊 ${productsWithValidImages.length} produits publiés synchronisés`);
  
  productsWithValidImages.forEach(p => {
    console.log(`  - ${p.name} (${p.productType}) - ${p.isFeatured ? '⭐ Vedette' : '📝 Normal'}`);
  });
  
  console.log('\n🧪 Pour tester les images, ouvrez :');
  console.log('   http://localhost:3000/test-images-simple.html');
};

syncProducts();
