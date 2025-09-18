const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [100, 'Le nom du produit ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Le prix original ne peut pas être négatif']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Le poids ne peut pas être négatif']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  features: [{
    name: String,
    value: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Nouveaux champs pour les spécificités des produits
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  // Pour les matériaux de construction
  unit: {
    type: String, // kg, m², m³, pièce, etc.
    default: 'pièce'
  },
  // Pour les produits électroniques
  warranty: {
    type: String, // "1 an", "2 ans", etc.
    default: ''
  },
  // Spécifications techniques (pour les produits électroniques)
  specifications: [{
    name: String,
    value: String
  }],
  // Pour les matériaux de construction - volume minimum pour devis
  minQuoteQuantity: {
    type: Number,
    default: 0
  },
  // Type de produit (construction ou electronique)
  productType: {
    type: String,
    enum: ['construction', 'electronique'],
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ productType: 1, isActive: 1 });
productSchema.index({ brand: 1, productType: 1 });
productSchema.index({ productType: 1, category: 1, isActive: 1 });

// Méthode pour calculer le pourcentage de réduction
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Méthode pour vérifier si le produit est en stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Méthode pour mettre à jour la note moyenne
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
