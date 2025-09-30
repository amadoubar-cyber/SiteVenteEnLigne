/**
 * 🔧 Script de Création d'Utilisateurs de Test
 * Bowoye Multi Services - Création des comptes de test
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Modèle utilisateur simplifié
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Utilisateurs de test à créer
const testUsers = [
  {
    firstName: 'Client',
    lastName: 'Test',
    email: 'client@bowoye.gn',
    password: 'password123',
    phone: '+224 123 456 789',
    role: 'user'
  },
  {
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou@bowoye.gn',
    password: 'password123',
    phone: '+224 987 654 321',
    role: 'user'
  },
  {
    firstName: 'Admin',
    lastName: 'Bowoye',
    email: 'admin@koula.gn',
    password: 'admin123',
    phone: '+224 555 123 456',
    role: 'admin'
  },
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@koula.gn',
    password: 'superadmin123',
    phone: '+224 777 888 999',
    role: 'admin'
  }
];

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
}

async function createTestUsers() {
  console.log('🔧 CRÉATION DES UTILISATEURS DE TEST');
  console.log('=====================================');
  console.log('');

  try {
    // Se connecter à la base de données
    await connectDB();

    // Vérifier si les utilisateurs existent déjà
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️ Utilisateur ${userData.email} existe déjà`);
      } else {
        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Créer l'utilisateur
        const user = new User({
          ...userData,
          password: hashedPassword
        });

        await user.save();
        console.log(`✅ Utilisateur créé: ${userData.email} (${userData.role})`);
      }
    }

    console.log('');
    console.log('🎉 CRÉATION TERMINÉE !');
    console.log('=======================');
    console.log('');
    console.log('👤 Comptes clients créés:');
    console.log('• client@bowoye.gn / password123');
    console.log('• mamadou@bowoye.gn / password123');
    console.log('');
    console.log('🛡️ Comptes admin créés:');
    console.log('• admin@koula.gn / admin123');
    console.log('• superadmin@koula.gn / superadmin123');
    console.log('');
    console.log('🚀 Vous pouvez maintenant tester la connexion !');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('');
    console.log('📡 Connexion MongoDB fermée');
  }
}

// Fonction pour créer des produits de test
async function createTestProducts() {
  console.log('🔧 CRÉATION DES PRODUITS DE TEST');
  console.log('=================================');
  console.log('');

  try {
    await connectDB();

    // Modèle produit simplifié
    const productSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      productType: {
        type: String,
        enum: ['construction', 'electronics'],
        required: true
      },
      category: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      images: [{
        type: String
      }],
      featured: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    const Product = mongoose.model('Product', productSchema);

    // Produits de test
    const testProducts = [
      {
        name: 'Ciment Portland 50kg',
        price: 8500,
        stock: 100,
        productType: 'construction',
        category: 'matériaux',
        description: 'Ciment Portland de qualité supérieure pour tous vos projets de construction',
        images: ['/images/products/construction/A3.jpeg'],
        featured: true
      },
      {
        name: 'Fer à Béton 12mm',
        price: 4500,
        stock: 50,
        productType: 'construction',
        category: 'armature',
        description: 'Fer à béton de 12mm pour renforcement des structures',
        images: ['/images/products/construction/A4.jpeg'],
        featured: true
      },
      {
        name: 'Téléphone Samsung Galaxy',
        price: 250000,
        stock: 10,
        productType: 'electronics',
        category: 'téléphones',
        description: 'Téléphone intelligent Samsung Galaxy dernière génération',
        images: ['/images/products/electronics/samsung.jpg'],
        featured: true
      },
      {
        name: 'Ordinateur Portable Dell',
        price: 450000,
        stock: 5,
        productType: 'electronics',
        category: 'informatique',
        description: 'Ordinateur portable Dell pour le travail et les loisirs',
        images: ['/images/products/electronics/dell.jpg'],
        featured: false
      }
    ];

    // Créer les produits
    for (const productData of testProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log(`⚠️ Produit ${productData.name} existe déjà`);
      } else {
        const product = new Product(productData);
        await product.save();
        console.log(`✅ Produit créé: ${productData.name} - ${productData.price} FCFA`);
      }
    }

    console.log('');
    console.log('🎉 PRODUITS DE TEST CRÉÉS !');
    console.log('============================');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Connexion MongoDB fermée');
  }
}

// Fonction principale
async function main() {
  console.log('🚀 INITIALISATION DES DONNÉES DE TEST');
  console.log('======================================');
  console.log('');

  // Créer les utilisateurs
  await createTestUsers();

  console.log('');
  
  // Créer les produits
  await createTestProducts();

  console.log('');
  console.log('✅ INITIALISATION TERMINÉE !');
  console.log('=============================');
  console.log('');
  console.log('🎯 Vous pouvez maintenant:');
  console.log('1. Tester la connexion avec les comptes créés');
  console.log('2. Naviguer dans l\'interface client');
  console.log('3. Accéder à l\'interface admin');
  console.log('4. Tester les fonctionnalités complètes');
  console.log('');
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createTestUsers,
  createTestProducts,
  main
};
