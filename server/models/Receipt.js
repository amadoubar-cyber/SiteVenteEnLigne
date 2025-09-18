const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  // Numéro de reçu unique
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Informations de la vente associée
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  
  // Informations de la dette associée (si applicable)
  debt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt'
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
  
  // Informations du reçu
  receiptType: {
    type: String,
    enum: ['sale', 'payment', 'refund', 'partial_payment'],
    required: true
  },
  
  // Montants
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    required: true,
    min: 0
  },
  remainingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Détails des produits/services
  items: [{
    productName: {
      type: String,
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
    },
    category: String
  }],
  
  // Informations de paiement
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'bank_transfer', 'credit_card', 'check'],
    required: true
  },
  paymentReference: String, // Numéro de transaction, chèque, etc.
  
  // Informations de livraison
  delivery: {
    address: String,
    city: String,
    deliveryPrice: {
      type: Number,
      default: 0
    },
    deliveryDate: Date,
    deliveryPerson: String
  },
  
  // Statut du reçu
  status: {
    type: String,
    enum: ['draft', 'issued', 'cancelled'],
    default: 'issued'
  },
  
  // Dates importantes
  issuedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  
  // Informations de l'entreprise
  companyInfo: {
    name: {
      type: String,
      default: 'Koula - Matériaux de Construction & Électronique'
    },
    address: {
      type: String,
      default: 'Bamako, Mali'
    },
    phone: {
      type: String,
      default: '+223 XX XX XX XX'
    },
    email: {
      type: String,
      default: 'contact@koula.ml'
    },
    taxId: String,
    logo: String
  },
  
  // Notes et conditions
  notes: String,
  terms: String,
  
  // Métadonnées
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Fichier PDF généré
  pdfPath: String,
  pdfGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ customer: 1 });
receiptSchema.index({ sale: 1 });
receiptSchema.index({ issuedAt: -1 });
receiptSchema.index({ status: 1 });

// Middleware pour générer le numéro de reçu
receiptSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Compter les reçus de ce mois
    const count = await this.constructor.countDocuments({
      receiptNumber: new RegExp(`^R${year}${month}`)
    });
    
    // Format: R2024010001 (R + année + mois + numéro séquentiel)
    this.receiptNumber = `R${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculer le montant restant
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  next();
});

// Méthodes statiques
receiptSchema.statics.generateReceiptNumber = async function() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const count = await this.countDocuments({
    receiptNumber: new RegExp(`^R${year}${month}`)
  });
  
  return `R${year}${month}${String(count + 1).padStart(4, '0')}`;
};

receiptSchema.statics.getReceiptsByDateRange = function(startDate, endDate) {
  return this.find({
    issuedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('customer sale debt issuedBy');
};

receiptSchema.statics.getReceiptStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        issuedAt: {
          $gte: startDate,
          $lte: endDate
        },
        status: 'issued'
      }
    },
    {
      $group: {
        _id: null,
        totalReceipts: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        totalPaid: { $sum: '$paidAmount' },
        totalRemaining: { $sum: '$remainingAmount' }
      }
    }
  ]);
};

// Méthodes d'instance
receiptSchema.methods.generatePDF = function() {
  // Cette méthode sera implémentée pour générer le PDF
  // Pour l'instant, on retourne le chemin du fichier
  return `/receipts/${this.receiptNumber}.pdf`;
};

receiptSchema.methods.isValid = function() {
  if (!this.validUntil) return true;
  return new Date() <= this.validUntil;
};

receiptSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

module.exports = mongoose.model('Receipt', receiptSchema);
