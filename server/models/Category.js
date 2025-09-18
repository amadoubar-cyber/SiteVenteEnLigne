const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true,
    maxlength: [50, 'Le nom de la catégorie ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // Nouveau champ pour identifier le type principal (construction ou electronique)
  mainType: {
    type: String,
    enum: ['construction', 'electronique'],
    required: true
  },
  // Ordre d'affichage dans la hiérarchie
  sortOrder: {
    type: Number,
    default: 0
  },
  // Icône pour l'affichage
  icon: {
    type: String,
    default: ''
  },
  // Couleur de la catégorie
  color: {
    type: String,
    default: '#3B82F6'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ mainType: 1, isActive: 1 });
categorySchema.index({ parentCategory: 1, isActive: 1 });
categorySchema.index({ mainType: 1, sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
