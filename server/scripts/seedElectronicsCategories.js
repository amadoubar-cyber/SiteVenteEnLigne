const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const electronicsCategories = [
  // Catégorie principale
  {
    name: 'Produits Électroniques',
    description: 'Tous les appareils électroniques et accessoires technologiques',
    mainType: 'electronique',
    sortOrder: 1,
    icon: '📱',
    color: '#3B82F6',
    isActive: true
  },
  // Sous-catégories
  {
    name: 'Téléphones & Tablettes',
    description: 'Smartphones, tablettes, accessoires et protections',
    mainType: 'electronique',
    sortOrder: 2,
    icon: '📱',
    color: '#1D4ED8',
    isActive: true
  },
  {
    name: 'Ordinateurs & Accessoires',
    description: 'PC, laptops, composants, périphériques et accessoires',
    mainType: 'electronique',
    sortOrder: 3,
    icon: '💻',
    color: '#7C3AED',
    isActive: true
  },
  {
    name: 'Électroménagers',
    description: 'Appareils électroménagers pour la maison et la cuisine',
    mainType: 'electronique',
    sortOrder: 4,
    icon: '🏠',
    color: '#059669',
    isActive: true
  },
  {
    name: 'Audio / Casques / Enceintes',
    description: 'Écouteurs, casques, enceintes et équipements audio',
    mainType: 'electronique',
    sortOrder: 5,
    icon: '🎧',
    color: '#DC2626',
    isActive: true
  },
  {
    name: 'Télévisions & Vidéo',
    description: 'TV, projecteurs, accessoires et équipements vidéo',
    mainType: 'electronique',
    sortOrder: 6,
    icon: '📺',
    color: '#0891B2',
    isActive: true
  },
  {
    name: 'Gaming',
    description: 'Consoles, jeux, accessoires gaming et réalité virtuelle',
    mainType: 'electronique',
    sortOrder: 7,
    icon: '🎮',
    color: '#7C2D12',
    isActive: true
  },
  {
    name: 'Photographie',
    description: 'Appareils photo, objectifs, accessoires et équipements',
    mainType: 'electronique',
    sortOrder: 8,
    icon: '📸',
    color: '#BE185D',
    isActive: true
  },
  {
    name: 'Smart Home',
    description: 'Objets connectés, domotique et équipements intelligents',
    mainType: 'electronique',
    sortOrder: 9,
    icon: '🏡',
    color: '#0D9488',
    isActive: true
  },
  {
    name: 'Accessoires & Câbles',
    description: 'Câbles, chargeurs, supports et petits accessoires',
    mainType: 'electronique',
    sortOrder: 10,
    icon: '🔌',
    color: '#6B7280',
    isActive: true
  }
];

async function seedElectronicsCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connecté à MongoDB');

    // Supprimer les anciennes catégories électroniques
    await Category.deleteMany({ mainType: 'electronique' });
    console.log('Anciennes catégories électroniques supprimées');

    // Créer les nouvelles catégories
    const createdCategories = await Category.insertMany(electronicsCategories);
    console.log(`${createdCategories.length} catégories électroniques créées`);

    // Afficher les catégories créées
    createdCategories.forEach(category => {
      console.log(`- ${category.icon} ${category.name} (${category.color})`);
    });

    console.log('✅ Catégories électroniques initialisées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des catégories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedElectronicsCategories();
}

module.exports = seedElectronicsCategories;
