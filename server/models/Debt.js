const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  // Informations de la vente associée
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
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
  customerAddress: {
    type: String,
    required: true
  },
  
  // Informations de la dette
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Statut de la dette
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  
  // Dates importantes
  dueDate: {
    type: Date,
    required: true
  },
  lastPaymentDate: {
    type: Date
  },
  paidAt: {
    type: Date
  },
  
  // Informations de paiement
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'bank_transfer', 'credit_card', 'check'],
    required: true
  },
  
  // Historique des paiements
  payments: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    notes: String,
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Informations de suivi
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  reminderCount: {
    type: Number,
    default: 0
  },
  
  // Notes et commentaires
  notes: String,
  internalNotes: String,
  
  // Métadonnées
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
debtSchema.index({ customer: 1 });
debtSchema.index({ status: 1 });
debtSchema.index({ dueDate: 1 });
debtSchema.index({ createdAt: -1 });

// Middleware pour calculer le montant restant
debtSchema.pre('save', function(next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  // Mettre à jour le statut basé sur le montant payé
  if (this.remainingAmount <= 0) {
    this.status = 'paid';
    this.paidAt = new Date();
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else if (this.dueDate < new Date() && this.status !== 'paid') {
    this.status = 'overdue';
  }
  
  next();
});

// Méthodes statiques
debtSchema.statics.getDebtsByStatus = function(status) {
  return this.find({ status }).populate('customer sale createdBy');
};

debtSchema.statics.getOverdueDebts = function() {
  return this.find({
    status: { $in: ['pending', 'partial'] },
    dueDate: { $lt: new Date() }
  }).populate('customer sale createdBy');
};

debtSchema.statics.getDebtsByCustomer = function(customerId) {
  return this.find({ customer: customerId }).populate('sale createdBy');
};

debtSchema.statics.getDebtStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        paidAmount: { $sum: '$paidAmount' },
        remainingAmount: { $sum: '$remainingAmount' }
      }
    }
  ]);
};

// Méthodes d'instance
debtSchema.methods.addPayment = function(paymentData) {
  this.payments.push(paymentData);
  this.paidAmount += paymentData.amount;
  this.lastPaymentDate = new Date();
  return this.save();
};

debtSchema.methods.isOverdue = function() {
  return this.dueDate < new Date() && this.status !== 'paid';
};

debtSchema.methods.getDaysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const diffTime = today - this.dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('Debt', debtSchema);
