const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Category = require('../models/Category');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const createCategories = async () => {
  try {
    console.log('🏷️  Création des catégories...\n');

    // Supprimer les anciennes catégories
    await Category.deleteMany({});
    console.log('🗑️  Anciennes catégories supprimées');

    // Créer les catégories
    const categories = [
      {
        name: 'Matériaux de Construction',
        description: 'Matériaux pour la construction et les travaux',
        slug: 'materiaux-construction',
        mainType: 'construction',
        isActive: true
      },
      {
        name: 'Électronique',
        description: 'Produits électroniques et accessoires',
        slug: 'electronique',
        mainType: 'electronique',
        isActive: true
      }
    ];

    const createdCategories = await Category.insertMany(categories);

    console.log('✅ Catégories créées :');
    createdCategories.forEach(category => {
      console.log(`   - ${category.name} (ID: ${category._id})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des catégories:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la création
connectDB().then(() => {
  createCategories();
});
