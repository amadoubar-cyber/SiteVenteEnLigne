const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L\'email du client est requis'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    }
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  validUntil: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Les notes admin ne peuvent pas dépasser 1000 caractères']
  },
  // Référence du devis
  quoteNumber: {
    type: String,
    unique: true,
    required: true
  },
  // Utilisateur qui a créé le devis (si connecté)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ 'customer.email': 1 });
quoteSchema.index({ quoteNumber: 1 });
quoteSchema.index({ validUntil: 1 });

// Méthode pour générer un numéro de devis
quoteSchema.statics.generateQuoteNumber = function() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `QT${year}${month}${day}${random}`;
};

// Méthode pour calculer le total
quoteSchema.methods.calculateTotal = function() {
  this.totalAmount = this.products.reduce((total, item) => total + item.totalPrice, 0);
  return this.totalAmount;
};

// Middleware pour générer le numéro de devis avant la sauvegarde
quoteSchema.pre('save', function(next) {
  if (this.isNew && !this.quoteNumber) {
    this.quoteNumber = this.constructor.generateQuoteNumber();
  }
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
