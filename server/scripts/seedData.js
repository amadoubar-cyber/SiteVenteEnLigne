const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('MongoDB connecté pour le seeding');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Données existantes supprimées');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Koula',
      email: 'admin@koula.gn',
      password: 'admin123',
      phone: '+224 123 456 789',
      role: 'admin',
      address: {
        street: 'Rue de la République',
        city: 'Conakry',
        country: 'Guinée'
      }
    });

    // Create test user
    const testUser = await User.create({
      firstName: 'Client',
      lastName: 'Test',
      email: 'client@koula.gn',
      password: 'password123',
      phone: '+224 987 654 321',
      role: 'user',
      address: {
        street: 'Avenue du Commerce',
        city: 'Conakry',
        country: 'Guinée'
      }
    });

    console.log('Utilisateurs créés');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Électronique',
        description: 'Smartphones, ordinateurs, accessoires électroniques',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
      },
      {
        name: 'Mode & Beauté',
        description: 'Vêtements, chaussures, produits de beauté',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
      },
      {
        name: 'Maison & Jardin',
        description: 'Décoration, mobilier, jardinage',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
      },
      {
        name: 'Sport & Loisirs',
        description: 'Équipements sportifs, jeux, loisirs',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'
      },
      {
        name: 'Alimentation',
        description: 'Produits alimentaires, boissons',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'
      }
    ]);

    console.log('Catégories créées');

    // Create products
    const products = await Product.create([
      {
        name: 'iPhone 14 Pro',
        description: 'Le dernier iPhone avec écran Super Retina XDR de 6,1 pouces, puce A16 Bionic et système de caméra Pro.',
        price: 1200000,
        originalPrice: 1300000,
        images: [
          { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', alt: 'iPhone 14 Pro' },
          { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', alt: 'iPhone 14 Pro dos' }
        ],
        category: categories[0]._id,
        stock: 15,
        sku: 'IPH14P-001',
        weight: 0.206,
        features: [
          { name: 'Écran', value: '6.1 pouces Super Retina XDR' },
          { name: 'Stockage', value: '128GB' },
          { name: 'Couleur', value: 'Or' }
        ],
        tags: ['smartphone', 'apple', 'premium'],
        isFeatured: true,
        vendor: adminUser._id
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'Smartphone Android haut de gamme avec écran AMOLED 6,1 pouces et triple caméra.',
        price: 950000,
        originalPrice: 1000000,
        images: [
          { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', alt: 'Samsung Galaxy S23' }
        ],
        category: categories[0]._id,
        stock: 20,
        sku: 'SGS23-001',
        weight: 0.168,
        features: [
          { name: 'Écran', value: '6.1 pouces AMOLED' },
          { name: 'Stockage', value: '256GB' },
          { name: 'Couleur', value: 'Noir' }
        ],
        tags: ['smartphone', 'samsung', 'android'],
        isFeatured: true,
        vendor: adminUser._id
      },
      {
        name: 'T-shirt Cotton Premium',
        description: 'T-shirt en coton 100% bio, confortable et durable. Disponible en plusieurs couleurs.',
        price: 25000,
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'T-shirt Cotton' }
        ],
        category: categories[1]._id,
        stock: 50,
        sku: 'TSH-COT-001',
        weight: 0.2,
        features: [
          { name: 'Matière', value: '100% Coton Bio' },
          { name: 'Taille', value: 'S, M, L, XL' },
          { name: 'Couleur', value: 'Blanc, Noir, Bleu' }
        ],
        tags: ['vêtement', 'cotton', 'bio'],
        vendor: adminUser._id
      },
      {
        name: 'Chaussures Sport Nike Air Max',
        description: 'Chaussures de sport Nike Air Max pour le running et l\'entraînement quotidien.',
        price: 180000,
        originalPrice: 200000,
        images: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Nike Air Max' }
        ],
        category: categories[1]._id,
        stock: 25,
        sku: 'NIKE-AM-001',
        weight: 0.8,
        features: [
          { name: 'Marque', value: 'Nike' },
          { name: 'Type', value: 'Running' },
          { name: 'Taille', value: '36-45' }
        ],
        tags: ['chaussures', 'sport', 'nike'],
        isFeatured: true,
        vendor: adminUser._id
      },
      {
        name: 'Laptop HP Pavilion',
        description: 'Ordinateur portable HP Pavilion avec processeur Intel i5, 8GB RAM et SSD 256GB.',
        price: 850000,
        originalPrice: 900000,
        images: [
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', alt: 'HP Pavilion' }
        ],
        category: categories[0]._id,
        stock: 8,
        sku: 'HP-PAV-001',
        weight: 1.8,
        features: [
          { name: 'Processeur', value: 'Intel Core i5' },
          { name: 'RAM', value: '8GB DDR4' },
          { name: 'Stockage', value: '256GB SSD' },
          { name: 'Écran', value: '15.6 pouces' }
        ],
        tags: ['laptop', 'hp', 'informatique'],
        vendor: adminUser._id
      },
      {
        name: 'Table de Jardin Extensible',
        description: 'Table de jardin en bois teck, extensible pour 6-8 personnes. Parfaite pour les repas en extérieur.',
        price: 450000,
        images: [
          { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', alt: 'Table de jardin' }
        ],
        category: categories[2]._id,
        stock: 5,
        sku: 'TAB-JARD-001',
        weight: 25,
        features: [
          { name: 'Matière', value: 'Bois Teck' },
          { name: 'Capacité', value: '6-8 personnes' },
          { name: 'Dimensions', value: '180x90cm (extensible)' }
        ],
        tags: ['mobilier', 'jardin', 'bois'],
        vendor: adminUser._id
      },
      {
        name: 'Ballon de Football Adidas',
        description: 'Ballon de football officiel Adidas, utilisé dans les compétitions internationales.',
        price: 35000,
        images: [
          { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', alt: 'Ballon Adidas' }
        ],
        category: categories[3]._id,
        stock: 30,
        sku: 'BAL-ADIDAS-001',
        weight: 0.4,
        features: [
          { name: 'Marque', value: 'Adidas' },
          { name: 'Type', value: 'Football' },
          { name: 'Taille', value: '5 (Standard)' }
        ],
        tags: ['sport', 'football', 'adidas'],
        vendor: adminUser._id
      },
      {
        name: 'Riz Basmati Premium',
        description: 'Riz Basmati de qualité premium, parfumé et à grain long. Emballage de 5kg.',
        price: 45000,
        images: [
          { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', alt: 'Riz Basmati' }
        ],
        category: categories[4]._id,
        stock: 100,
        sku: 'RIZ-BAS-001',
        weight: 5,
        features: [
          { name: 'Type', value: 'Basmati Premium' },
          { name: 'Poids', value: '5kg' },
          { name: 'Origine', value: 'Inde' }
        ],
        tags: ['alimentation', 'riz', 'basmati'],
        vendor: adminUser._id
      }
    ]);

    console.log('Produits créés');

    // Update categories with products
    for (let i = 0; i < categories.length; i++) {
      const categoryProducts = products.filter(p => p.category.toString() === categories[i]._id.toString());
      await Category.findByIdAndUpdate(categories[i]._id, {
        products: categoryProducts.map(p => p._id)
      });
    }

    console.log('Catégories mises à jour avec les produits');

    console.log('✅ Données de test créées avec succès !');
    console.log('\n📋 Comptes créés :');
    console.log('👤 Admin: admin@koula.gn / admin123');
    console.log('👤 Client: client@koula.gn / password123');
    console.log('\n📦 Données créées :');
    console.log(`- ${categories.length} catégories`);
    console.log(`- ${products.length} produits`);
    console.log(`- ${await User.countDocuments()} utilisateurs`);

  } catch (error) {
    console.error('Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});
