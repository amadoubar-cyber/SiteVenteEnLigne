const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut pas être négatif']
    }
  }],
  shippingAddress: {
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
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'Guinée'
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'orange_money', 'card', 'cash_on_delivery'],
    required: [true, 'La méthode de paiement est requise']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Le sous-total ne peut pas être négatif']
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Les frais de livraison ne peuvent pas être négatifs']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'La taxe ne peut pas être négative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Le total ne peut pas être négatif']
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// Middleware pour générer le numéro de commande
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `KOU-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Méthode pour calculer le total
orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.shippingCost + this.tax;
};

// Méthode pour vérifier si la commande peut être annulée
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.orderStatus);
};

// Méthode pour mettre à jour le statut
orderSchema.methods.updateStatus = function(newStatus) {
  this.orderStatus = newStatus;
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
};

module.exports = mongoose.model('Order', orderSchema);
