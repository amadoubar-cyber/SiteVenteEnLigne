const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  // Informations du produit vendu
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true,
    enum: ['construction', 'electronics']
  },
  
  // Informations de la vente
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
  },
  
  // Informations du client
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  
  // Informations de livraison
  delivery: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    deliveryPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveredAt: {
      type: Date
    },
    deliveryPerson: {
      type: String
    }
  },
  
  // Statut de la vente
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Informations de paiement
  payment: {
    method: {
      type: String,
      enum: ['cash', 'mobile_money', 'bank_transfer', 'credit_card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: {
      type: Date
    }
  },
  
  // Métadonnées
  soldAt: {
    type: Date,
    default: Date.now
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notes
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
saleSchema.index({ soldAt: -1 });
saleSchema.index({ product: 1 });
saleSchema.index({ customer: 1 });
saleSchema.index({ status: 1 });
saleSchema.index({ 'delivery.status': 1 });

// Middleware pour calculer le prix total
saleSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

// Méthodes statiques
saleSchema.statics.getDailySales = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    soldAt: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $ne: 'cancelled' }
  }).populate('product customer soldBy');
};

saleSchema.statics.getSalesByPeriod = function(startDate, endDate) {
  return this.find({
    soldAt: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $ne: 'cancelled' }
  }).populate('product customer soldBy');
};

saleSchema.statics.getSalesStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        soldAt: {
          $gte: startDate,
          $lte: endDate
        },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
        totalQuantity: { $sum: '$quantity' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
};

module.exports = mongoose.model('Sale', saleSchema);
