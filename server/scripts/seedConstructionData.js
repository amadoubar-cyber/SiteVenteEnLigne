const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Catégories spécialisées pour matériel de construction
const constructionCategories = [
  {
    name: "Ciment & Mortier",
    description: "Ciment, mortier, colle, enduits et produits de maçonnerie",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Acier & Ferraillage",
    description: "Barres d'armature, treillis soudés, tôles et profilés métalliques",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Briques & Blocs",
    description: "Briques, blocs de béton, parpaings et éléments de construction",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Sable & Gravier",
    description: "Sable, gravier, cailloux et granulats pour construction",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Outillage",
    description: "Outils de construction, équipements de chantier et accessoires",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Électricité",
    description: "Câbles, fils, prises, interrupteurs et matériel électrique",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Plomberie",
    description: "Tuyaux, raccords, robinets et matériel de plomberie",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  },
  {
    name: "Toiture & Couverture",
    description: "Tuiles, tôles, gouttières et matériaux de couverture",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500"
  }
];

// Produits de construction d'exemple
const constructionProducts = [
  {
    name: "Ciment Portland 50kg",
    description: "Ciment Portland de qualité supérieure pour tous types de construction. Résistance élevée et durabilité garantie.",
    price: 45000,
    originalPrice: 50000,
    stock: 200,
    category: "Ciment & Mortier",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: true,
    discountPercentage: 10,
    specifications: {
      "Poids": "50kg",
      "Type": "Portland",
      "Résistance": "32.5 MPa",
      "Durée de vie": "12 mois",
      "Origine": "Guinée"
    }
  },
  {
    name: "Barres d'Armature 12mm",
    description: "Barres d'armature en acier de 12mm de diamètre. Longueur standard 12m. Idéal pour renforcement béton armé.",
    price: 8500,
    originalPrice: 9000,
    stock: 150,
    category: "Acier & Ferraillage",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: true,
    discountPercentage: 6,
    specifications: {
      "Diamètre": "12mm",
      "Longueur": "12m",
      "Matériau": "Acier",
      "Poids": "8.9kg/m",
      "Norme": "NF A 35-015"
    }
  },
  {
    name: "Briques Rouges 20x10x5cm",
    description: "Briques rouges traditionnelles de 20x10x5cm. Résistantes et durables pour construction de murs.",
    price: 150,
    originalPrice: 160,
    stock: 5000,
    category: "Briques & Blocs",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: false,
    discountPercentage: 6,
    specifications: {
      "Dimensions": "20x10x5cm",
      "Type": "Brique rouge",
      "Quantité": "500 briques/palette",
      "Résistance": "15 MPa",
      "Usage": "Murs porteurs"
    }
  },
  {
    name: "Sable de Construction 1m³",
    description: "Sable de construction lavé et tamisé. Idéal pour mortier, béton et enduits. Livraison en camion.",
    price: 25000,
    originalPrice: 28000,
    stock: 50,
    category: "Sable & Gravier",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: false,
    discountPercentage: 11,
    specifications: {
      "Volume": "1m³",
      "Type": "Sable lavé",
      "Granulométrie": "0/4mm",
      "Livraison": "Camion 6m³",
      "Zone": "Conakry et environs"
    }
  },
  {
    name: "Marteau de Maçon 1.5kg",
    description: "Marteau de maçon professionnel 1.5kg avec manche en bois. Idéal pour démolition et construction.",
    price: 12000,
    originalPrice: 13000,
    stock: 25,
    category: "Outillage",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: false,
    discountPercentage: 8,
    specifications: {
      "Poids": "1.5kg",
      "Manche": "Bois dur",
      "Tête": "Acier trempé",
      "Longueur": "35cm",
      "Garantie": "1 an"
    }
  },
  {
    name: "Câble Électrique 2.5mm²",
    description: "Câble électrique rigide 2.5mm², 100m. Pour installation électrique domestique et industrielle.",
    price: 45000,
    originalPrice: 48000,
    stock: 30,
    category: "Électricité",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: false,
    discountPercentage: 6,
    specifications: {
      "Section": "2.5mm²",
      "Longueur": "100m",
      "Type": "Rigide",
      "Tension": "450/750V",
      "Norme": "NF C 32-321"
    }
  },
  {
    name: "Tuyau PVC 32mm",
    description: "Tuyau PVC pour évacuation 32mm, longueur 3m. Résistant aux intempéries et aux produits chimiques.",
    price: 3500,
    originalPrice: 3800,
    stock: 100,
    category: "Plomberie",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: false,
    discountPercentage: 8,
    specifications: {
      "Diamètre": "32mm",
      "Longueur": "3m",
      "Matériau": "PVC",
      "Usage": "Évacuation",
      "Pression": "6 bars"
    }
  },
  {
    name: "Tôle Ondulée 2m",
    description: "Tôle ondulée galvanisée 2m de long. Idéale pour toiture et clôture. Résistante à la corrosion.",
    price: 18000,
    originalPrice: 20000,
    stock: 80,
    category: "Toiture & Couverture",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500" }
    ],
    featured: true,
    discountPercentage: 10,
    specifications: {
      "Longueur": "2m",
      "Largeur": "1m",
      "Épaisseur": "0.5mm",
      "Traitement": "Galvanisé",
      "Usage": "Toiture/Clôture"
    }
  }
];

async function seedConstructionData() {
  try {
    console.log('🏗️ Début du seeding pour matériel de construction...');
    
    // Supprimer les données existantes
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Données existantes supprimées');
    
    // Créer l'utilisateur admin s'il n'existe pas
    const existingAdmin = await User.findOne({ email: 'admin@koula.gn' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        firstName: 'Admin',
        lastName: 'Koula Construction',
        email: 'admin@koula.gn',
        password: hashedPassword,
        role: 'admin',
        phone: '+224 123 456 789',
        address: {
          street: 'Administration Koula',
          city: 'Conakry',
          country: 'Guinée'
        },
        isEmailVerified: true
      });
      await admin.save();
      console.log('👤 Compte admin créé');
    }
    
    // Créer les catégories
    const createdCategories = [];
    for (const categoryData of constructionCategories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
      console.log(`📂 Catégorie créée: ${savedCategory.name}`);
    }
    
    // Créer un mapping des catégories
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Créer les produits
    const createdProducts = [];
    for (const productData of constructionProducts) {
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
      console.log(`📦 Produit créé: ${savedProduct.name}`);
    }
    
    console.log('\n🎉 Seeding terminé avec succès !');
    console.log(`📂 ${createdCategories.length} catégories créées`);
    console.log(`📦 ${createdProducts.length} produits créés`);
    
    // Afficher le résumé
    console.log('\n📋 Résumé des catégories:');
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
    });
    
    console.log('\n📋 Résumé des produits:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price.toLocaleString()} GNF (Stock: ${product.stock})`);
    });
    
    console.log('\n🔐 Compte administrateur:');
    console.log('📧 Email: admin@koula.gn');
    console.log('🔑 Mot de passe: admin123');
    console.log('🌐 URL: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter le seeding
seedConstructionData();
