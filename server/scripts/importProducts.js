const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Exemple de données de vos produits
const sampleProducts = [
  {
    name: "Smartphone Samsung Galaxy A54",
    description: "Smartphone Android avec écran 6.4 pouces, 128GB de stockage, appareil photo 50MP",
    price: 450000,
    originalPrice: 500000,
    stock: 25,
    category: "Électronique",
    images: [
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" }
    ],
    featured: true,
    discountPercentage: 10,
    specifications: {
      "Écran": "6.4 pouces Super AMOLED",
      "Stockage": "128GB",
      "RAM": "6GB",
      "Appareil photo": "50MP + 12MP + 5MP",
      "Batterie": "5000mAh"
    }
  },
  {
    name: "Ordinateur Portable HP Pavilion",
    description: "Laptop HP Pavilion 15 pouces, Intel i5, 8GB RAM, 512GB SSD",
    price: 1200000,
    originalPrice: 1350000,
    stock: 8,
    category: "Informatique",
    images: [
      { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" }
    ],
    featured: true,
    discountPercentage: 11,
    specifications: {
      "Processeur": "Intel Core i5-1135G7",
      "RAM": "8GB DDR4",
      "Stockage": "512GB SSD",
      "Écran": "15.6 pouces Full HD",
      "Système": "Windows 11"
    }
  },
  {
    name: "Télévision LED 55 pouces",
    description: "TV LED 55 pouces 4K Ultra HD, Smart TV avec Android TV",
    price: 800000,
    originalPrice: 900000,
    stock: 12,
    category: "Électronique",
    images: [
      { url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500" }
    ],
    featured: false,
    discountPercentage: 11,
    specifications: {
      "Taille": "55 pouces",
      "Résolution": "4K Ultra HD (3840x2160)",
      "Smart TV": "Android TV",
      "Connectivité": "WiFi, Bluetooth, HDMI x3",
      "Son": "Dolby Audio"
    }
  },
  {
    name: "Réfrigérateur 300L",
    description: "Réfrigérateur 2 portes, 300L, classe énergétique A++",
    price: 650000,
    originalPrice: 700000,
    stock: 6,
    category: "Électroménager",
    images: [
      { url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500" }
    ],
    featured: false,
    discountPercentage: 7,
    specifications: {
      "Capacité": "300L",
      "Type": "2 portes",
      "Classe énergétique": "A++",
      "Fonctions": "No Frost, Multi Air Flow",
      "Garantie": "2 ans"
    }
  },
  {
    name: "Machine à Laver 8kg",
    description: "Lave-linge 8kg, 1200 tours/min, classe énergétique A+++",
    price: 450000,
    originalPrice: 480000,
    stock: 10,
    category: "Électroménager",
    images: [
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500" }
    ],
    featured: false,
    discountPercentage: 6,
    specifications: {
      "Capacité": "8kg",
      "Vitesse": "1200 tours/min",
      "Classe énergétique": "A+++",
      "Programmes": "15 programmes",
      "Garantie": "2 ans"
    }
  },
  {
    name: "Tablette iPad Air",
    description: "Tablette Apple iPad Air 10.9 pouces, 64GB, WiFi",
    price: 750000,
    originalPrice: 800000,
    stock: 15,
    category: "Électronique",
    images: [
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500" }
    ],
    featured: true,
    discountPercentage: 6,
    specifications: {
      "Écran": "10.9 pouces Liquid Retina",
      "Stockage": "64GB",
      "Processeur": "Apple M1",
      "Connectivité": "WiFi",
      "Autonomie": "Jusqu'à 10h"
    }
  },
  {
    name: "Chaussures Nike Air Max",
    description: "Baskets Nike Air Max 270, taille 42, couleur noire",
    price: 85000,
    originalPrice: 95000,
    stock: 30,
    category: "Mode",
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500" }
    ],
    featured: false,
    discountPercentage: 11,
    specifications: {
      "Marque": "Nike",
      "Modèle": "Air Max 270",
      "Taille": "42",
      "Couleur": "Noire",
      "Matériau": "Mesh et cuir synthétique"
    }
  },
  {
    name: "Sac à Main Cuir",
    description: "Sac à main en cuir véritable, compartiments multiples, couleur marron",
    price: 120000,
    originalPrice: 140000,
    stock: 20,
    category: "Mode",
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" }
    ],
    featured: false,
    discountPercentage: 14,
    specifications: {
      "Matériau": "Cuir véritable",
      "Couleur": "Marron",
      "Dimensions": "30x20x10 cm",
      "Compartiments": "3 compartiments",
      "Fermeture": "Fermeture éclair"
    }
  }
];

async function importProducts() {
  try {
    console.log('🔄 Début de l\'import des produits...');
    
    // Récupérer les catégories existantes
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    console.log('📂 Catégories trouvées:', Object.keys(categoryMap));
    
    // Créer les produits
    const createdProducts = [];
    
    for (const productData of sampleProducts) {
      // Trouver l'ID de la catégorie
      const categoryId = categoryMap[productData.category];
      
      if (!categoryId) {
        console.log(`⚠️  Catégorie "${productData.category}" non trouvée, création...`);
        const newCategory = new Category({
          name: productData.category,
          description: `Catégorie ${productData.category}`,
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
        });
        await newCategory.save();
        categoryMap[productData.category] = newCategory._id;
      }
      
      // Créer le produit
      const product = new Product({
        ...productData,
        category: categoryMap[productData.category],
        rating: {
          average: Math.random() * 2 + 3, // Note entre 3 et 5
          count: Math.floor(Math.random() * 50) + 10 // Entre 10 et 60 avis
        }
      });
      
      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
      
      console.log(`✅ Produit créé: ${savedProduct.name}`);
    }
    
    console.log(`\n🎉 Import terminé avec succès !`);
    console.log(`📦 ${createdProducts.length} produits importés`);
    
    // Afficher le résumé
    console.log('\n📋 Résumé des produits importés:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price.toLocaleString()} GNF (Stock: ${product.stock})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter l'import
importProducts();
