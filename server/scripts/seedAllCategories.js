const mongoose = require('mongoose');
const seedConstructionCategories = require('./seedConstructionCategories');
const seedElectronicsCategories = require('./seedElectronicsCategories');
require('dotenv').config();

async function seedAllCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('🚀 Initialisation de toutes les catégories...\n');

    // Initialiser les catégories de construction
    console.log('📦 Initialisation des catégories de construction...');
    await seedConstructionCategories();
    console.log('');

    // Initialiser les catégories électroniques
    console.log('📱 Initialisation des catégories électroniques...');
    await seedElectronicsCategories();
    console.log('');

    console.log('✅ Toutes les catégories ont été initialisées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des catégories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedAllCategories();
}

module.exports = seedAllCategories;
