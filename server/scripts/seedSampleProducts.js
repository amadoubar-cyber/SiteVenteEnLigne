const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const sampleProducts = [
  // Matériaux de construction
  {
    name: 'Ciment Portland 50kg',
    description: 'Ciment Portland de haute qualité pour tous types de construction',
    price: 45000,
    originalPrice: 50000,
    images: [{ url: '/placeholder-construction.jpg', alt: 'Ciment Portland' }],
    category: null, // Sera rempli dynamiquement
    stock: 100,
    sku: 'CEM-001',
    weight: 50,
    unit: 'sac',
    brand: 'Lafarge',
    productType: 'construction',
    minQuoteQuantity: 10,
    features: [
      { name: 'Type', value: 'Portland' },
      { name: 'Poids', value: '50kg' },
      { name: 'Résistance', value: '32.5 MPa' }
    ],
    tags: ['ciment', 'construction', 'béton'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Fer à béton 12mm',
    description: 'Barres de fer à béton de 12mm de diamètre, longueur 12m',
    price: 8500,
    images: [{ url: '/placeholder-construction.jpg', alt: 'Fer à béton' }],
    category: null,
    stock: 50,
    sku: 'FER-012',
    weight: 8.9,
    unit: 'barre',
    brand: 'ArcelorMittal',
    productType: 'construction',
    minQuoteQuantity: 5,
    features: [
      { name: 'Diamètre', value: '12mm' },
      { name: 'Longueur', value: '12m' },
      { name: 'Poids', value: '8.9kg/m' }
    ],
    tags: ['fer', 'béton', 'armature'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Peinture acrylique blanche 20L',
    description: 'Peinture acrylique de qualité supérieure pour intérieur et extérieur',
    price: 125000,
    originalPrice: 140000,
    images: [{ url: '/placeholder-construction.jpg', alt: 'Peinture acrylique' }],
    category: null,
    stock: 25,
    sku: 'PEI-001',
    weight: 20,
    unit: 'bidon',
    brand: 'Dulux',
    productType: 'construction',
    minQuoteQuantity: 1,
    features: [
      { name: 'Type', value: 'Acrylique' },
      { name: 'Volume', value: '20L' },
      { name: 'Rendement', value: '8-10 m²/L' }
    ],
    tags: ['peinture', 'acrylique', 'blanc'],
    isActive: true,
    isFeatured: false
  },
  // Produits électroniques
  {
    name: 'Samsung Galaxy A54 5G',
    description: 'Smartphone Android avec écran 6.4", 128GB, 8GB RAM',
    price: 450000,
    originalPrice: 500000,
    images: [{ url: '/placeholder-electronics.jpg', alt: 'Samsung Galaxy A54' }],
    category: null,
    stock: 15,
    sku: 'SAM-A54',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    productType: 'electronique',
    warranty: '2 ans',
    specifications: [
      { name: 'Écran', value: '6.4" Super AMOLED' },
      { name: 'Stockage', value: '128GB' },
      { name: 'RAM', value: '8GB' },
      { name: 'Caméra', value: '50MP + 12MP + 5MP' },
      { name: 'Batterie', value: '5000mAh' }
    ],
    tags: ['smartphone', 'samsung', '5g'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'MacBook Air M2 13"',
    description: 'Ordinateur portable Apple avec puce M2, 256GB SSD, 8GB RAM',
    price: 2500000,
    images: [{ url: '/placeholder-electronics.jpg', alt: 'MacBook Air M2' }],
    category: null,
    stock: 8,
    sku: 'MAC-M2-13',
    brand: 'Apple',
    model: 'MacBook Air M2',
    productType: 'electronique',
    warranty: '1 an',
    specifications: [
      { name: 'Processeur', value: 'Apple M2' },
      { name: 'Écran', value: '13.6" Liquid Retina' },
      { name: 'Stockage', value: '256GB SSD' },
      { name: 'RAM', value: '8GB' },
      { name: 'Autonomie', value: '18h' }
    ],
    tags: ['macbook', 'apple', 'laptop'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Casque audio sans fil avec réduction de bruit active',
    price: 180000,
    originalPrice: 200000,
    images: [{ url: '/placeholder-electronics.jpg', alt: 'Sony WH-1000XM5' }],
    category: null,
    stock: 12,
    sku: 'SON-WH1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    productType: 'electronique',
    warranty: '2 ans',
    specifications: [
      { name: 'Type', value: 'Over-ear sans fil' },
      { name: 'Réduction de bruit', value: 'Active' },
      { name: 'Autonomie', value: '30h' },
      { name: 'Bluetooth', value: '5.2' },
      { name: 'Poids', value: '250g' }
    ],
    tags: ['casque', 'sony', 'bluetooth'],
    isActive: true,
    isFeatured: false
  }
];

async function seedSampleProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connecté à MongoDB');

    // Récupérer les catégories
    const constructionCategories = await Category.find({ mainType: 'construction' });
    const electronicsCategories = await Category.find({ mainType: 'electronique' });

    if (constructionCategories.length === 0 || electronicsCategories.length === 0) {
      console.log('❌ Veuillez d\'abord initialiser les catégories');
      return;
    }

    // Supprimer les anciens produits d'exemple
    await Product.deleteMany({ sku: { $in: sampleProducts.map(p => p.sku) } });
    console.log('Anciens produits d\'exemple supprimés');

    // Assigner les catégories aux produits
    const productsWithCategories = sampleProducts.map(product => {
      const newProduct = { ...product };
      
      if (product.productType === 'construction') {
        // Assigner à la catégorie appropriée
        if (product.name.includes('Ciment')) {
          newProduct.category = constructionCategories.find(c => c.name.includes('Béton'))?._id;
        } else if (product.name.includes('Fer')) {
          newProduct.category = constructionCategories.find(c => c.name.includes('Métaux'))?._id;
        } else if (product.name.includes('Peinture')) {
          newProduct.category = constructionCategories.find(c => c.name.includes('Peinture'))?._id;
        }
        
        // Si aucune catégorie spécifique trouvée, utiliser la première catégorie de construction
        if (!newProduct.category) {
          newProduct.category = constructionCategories[0]._id;
        }
      } else if (product.productType === 'electronique') {
        // Assigner à la catégorie appropriée
        if (product.name.includes('Galaxy') || product.name.includes('iPhone')) {
          newProduct.category = electronicsCategories.find(c => c.name.includes('Téléphones'))?._id;
        } else if (product.name.includes('MacBook') || product.name.includes('Laptop')) {
          newProduct.category = electronicsCategories.find(c => c.name.includes('Ordinateurs'))?._id;
        } else if (product.name.includes('Casque') || product.name.includes('Audio')) {
          newProduct.category = electronicsCategories.find(c => c.name.includes('Audio'))?._id;
        }
        
        // Si aucune catégorie spécifique trouvée, utiliser la première catégorie électronique
        if (!newProduct.category) {
          newProduct.category = electronicsCategories[0]._id;
        }
      }
      
      return newProduct;
    });

    // Créer les produits
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`${createdProducts.length} produits d'exemple créés`);

    // Afficher les produits créés
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.productType}) - ${product.brand || 'Sans marque'}`);
    });

    console.log('✅ Produits d\'exemple initialisés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des produits:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedSampleProducts();
}

module.exports = seedSampleProducts;
