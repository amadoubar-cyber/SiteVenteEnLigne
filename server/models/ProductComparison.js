const mongoose = require('mongoose');

const productComparisonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  // Type de comparaison (construction ou electronique)
  comparisonType: {
    type: String,
    enum: ['construction', 'electronique'],
    required: true
  },
  // Nom de la comparaison (optionnel)
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  // Date de dernière modification
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
productComparisonSchema.index({ user: 1, comparisonType: 1 });
productComparisonSchema.index({ lastModified: -1 });

// Validation pour s'assurer qu'il n'y a pas plus de 4 produits en comparaison
productComparisonSchema.pre('save', function(next) {
  if (this.products.length > 4) {
    return next(new Error('Maximum 4 produits peuvent être comparés simultanément'));
  }
  if (this.products.length < 2) {
    return next(new Error('Au moins 2 produits sont requis pour une comparaison'));
  }
  next();
});

// Méthode pour ajouter un produit à la comparaison
productComparisonSchema.methods.addProduct = function(productId) {
  if (this.products.length >= 4) {
    throw new Error('Maximum 4 produits peuvent être comparés simultanément');
  }
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    this.lastModified = new Date();
  }
  return this;
};

// Méthode pour retirer un produit de la comparaison
productComparisonSchema.methods.removeProduct = function(productId) {
  this.products = this.products.filter(id => !id.equals(productId));
  this.lastModified = new Date();
  return this;
};

module.exports = mongoose.model('ProductComparison', productComparisonSchema);
