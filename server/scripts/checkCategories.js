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

const checkCategories = async () => {
  try {
    console.log('🏷️  Vérification des catégories...\n');

    // Lister toutes les catégories
    const allCategories = await Category.find({});
    console.log(`📊 Total de catégories: ${allCategories.length}\n`);

    if (allCategories.length === 0) {
      console.log('❌ Aucune catégorie trouvée dans la base de données');
      return;
    }

    allCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   ID: ${category._id}`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   Main Type: ${category.mainType}`);
      console.log(`   Actif: ${category.isActive}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la vérification
connectDB().then(() => {
  checkCategories();
});
