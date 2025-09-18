const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const constructionCategories = [
  // Catégorie principale
  {
    name: 'Matériaux de Construction',
    description: 'Tous les matériaux nécessaires pour la construction et la rénovation',
    mainType: 'construction',
    sortOrder: 1,
    icon: '🏗️',
    color: '#F59E0B',
    isActive: true
  },
  // Sous-catégories
  {
    name: 'Béton / Ciment',
    description: 'Ciment, béton prêt à l\'emploi, mortier et produits dérivés',
    mainType: 'construction',
    sortOrder: 2,
    icon: '🧱',
    color: '#6B7280',
    isActive: true
  },
  {
    name: 'Métaux / Ferraille',
    description: 'Fers à béton, tôles, profilés métalliques et accessoires',
    mainType: 'construction',
    sortOrder: 3,
    icon: '🔩',
    color: '#374151',
    isActive: true
  },
  {
    name: 'Peinture / Vernis',
    description: 'Peintures intérieures et extérieures, vernis, enduits et accessoires',
    mainType: 'construction',
    sortOrder: 4,
    icon: '🎨',
    color: '#8B5CF6',
    isActive: true
  },
  {
    name: 'Outils et Accessoires',
    description: 'Outils de construction, équipements de sécurité et accessoires',
    mainType: 'construction',
    sortOrder: 5,
    icon: '🔨',
    color: '#EF4444',
    isActive: true
  },
  {
    name: 'Isolation',
    description: 'Matériaux d\'isolation thermique et phonique',
    mainType: 'construction',
    sortOrder: 6,
    icon: '🧊',
    color: '#06B6D4',
    isActive: true
  },
  {
    name: 'Plomberie',
    description: 'Tubes, raccords, robinets et accessoires de plomberie',
    mainType: 'construction',
    sortOrder: 7,
    icon: '🚿',
    color: '#0EA5E9',
    isActive: true
  },
  {
    name: 'Électricité',
    description: 'Câbles, prises, interrupteurs et accessoires électriques',
    mainType: 'construction',
    sortOrder: 8,
    icon: '⚡',
    color: '#F59E0B',
    isActive: true
  },
  {
    name: 'Carrelage / Faïence',
    description: 'Carreaux, faïences, joints et accessoires de pose',
    mainType: 'construction',
    sortOrder: 9,
    icon: '🔲',
    color: '#10B981',
    isActive: true
  },
  {
    name: 'Bois et Dérivés',
    description: 'Planches, poutres, panneaux et accessoires en bois',
    mainType: 'construction',
    sortOrder: 10,
    icon: '🪵',
    color: '#92400E',
    isActive: true
  }
];

async function seedConstructionCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connecté à MongoDB');

    // Supprimer les anciennes catégories de construction
    await Category.deleteMany({ mainType: 'construction' });
    console.log('Anciennes catégories de construction supprimées');

    // Créer les nouvelles catégories
    const createdCategories = await Category.insertMany(constructionCategories);
    console.log(`${createdCategories.length} catégories de construction créées`);

    // Afficher les catégories créées
    createdCategories.forEach(category => {
      console.log(`- ${category.icon} ${category.name} (${category.color})`);
    });

    console.log('✅ Catégories de construction initialisées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des catégories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedConstructionCategories();
}

module.exports = seedConstructionCategories;
