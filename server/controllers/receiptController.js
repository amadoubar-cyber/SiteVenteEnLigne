const Receipt = require('../models/Receipt');
const Debt = require('../models/Debt');
const Sale = require('../models/Sale');
const { protect } = require('../middleware/auth');

// @desc    Générer un reçu
// @route   POST /api/receipts
// @access  Private
const generateReceipt = async (req, res) => {
  try {
    const {
      saleId,
      debtId,
      receiptType,
      paymentMethod,
      paymentReference,
      notes
    } = req.body;

    let sale, debt;

    // Vérifier la vente
    if (saleId) {
      sale = await Sale.findById(saleId).populate('customer');
      if (!sale) {
        return res.status(404).json({ message: 'Vente non trouvée' });
      }
    }

    // Vérifier la dette
    if (debtId) {
      debt = await Debt.findById(debtId).populate('customer sale');
      if (!debt) {
        return res.status(404).json({ message: 'Dette non trouvée' });
      }
      sale = debt.sale;
    }

    if (!sale) {
      return res.status(400).json({ message: 'Vente ou dette requise' });
    }

    // Générer le numéro de reçu
    const receiptNumber = await Receipt.generateReceiptNumber();

    // Créer le reçu
    const receipt = new Receipt({
      receiptNumber,
      sale: sale._id,
      debt: debtId,
      customer: sale.customer._id,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      customerAddress: sale.delivery.address,
      receiptType,
      totalAmount: sale.totalPrice + (sale.delivery.deliveryPrice || 0),
      paidAmount: debt ? debt.paidAmount : sale.totalPrice + (sale.delivery.deliveryPrice || 0),
      items: [{
        productName: sale.productName,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        totalPrice: sale.totalPrice,
        category: sale.productCategory
      }],
      paymentMethod,
      paymentReference,
      delivery: sale.delivery,
      notes,
      issuedBy: req.user.id
    });

    await receipt.save();

    res.status(201).json({
      success: true,
      data: await receipt.populate('customer sale debt issuedBy')
    });

  } catch (error) {
    console.error('Erreur lors de la génération du reçu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la génération du reçu' 
    });
  }
};

// @desc    Obtenir tous les reçus
// @route   GET /api/receipts
// @access  Private
const getReceipts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      receiptType,
      customer,
      startDate,
      endDate,
      status
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (receiptType) filter.receiptType = receiptType;
    if (customer) filter.customer = customer;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.issuedAt = {};
      if (startDate) filter.issuedAt.$gte = new Date(startDate);
      if (endDate) filter.issuedAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { issuedAt: -1 },
      populate: 'customer sale debt issuedBy'
    };

    const receipts = await Receipt.paginate(filter, options);

    res.json({
      success: true,
      data: receipts
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des reçus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des reçus' 
    });
  }
};

// @desc    Obtenir un reçu par ID
// @route   GET /api/receipts/:id
// @access  Private
const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('customer sale debt issuedBy');

    if (!receipt) {
      return res.status(404).json({ message: 'Reçu non trouvé' });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du reçu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération du reçu' 
    });
  }
};

// @desc    Obtenir un reçu par numéro
// @route   GET /api/receipts/number/:number
// @access  Private
const getReceiptByNumber = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ receiptNumber: req.params.number })
      .populate('customer sale debt issuedBy');

    if (!receipt) {
      return res.status(404).json({ message: 'Reçu non trouvé' });
    }

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du reçu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération du reçu' 
    });
  }
};

// @desc    Obtenir les statistiques des reçus
// @route   GET /api/receipts/stats
// @access  Private
const getReceiptStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Par défaut, les 30 derniers jours
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - 30);
    }

    const stats = await Receipt.getReceiptStats(start, end);
    
    // Obtenir les reçus par type
    const byType = await Receipt.aggregate([
      {
        $match: {
          issuedAt: { $gte: start, $lte: end },
          status: 'issued'
        }
      },
      {
        $group: {
          _id: '$receiptType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Obtenir les reçus par jour
    const byDay = await Receipt.aggregate([
      {
        $match: {
          issuedAt: { $gte: start, $lte: end },
          status: 'issued'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' },
            month: { $month: '$issuedAt' },
            day: { $dayOfMonth: '$issuedAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalReceipts: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalRemaining: 0
        },
        byType,
        byDay
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des statistiques' 
    });
  }
};

// @desc    Annuler un reçu
// @route   PUT /api/receipts/:id/cancel
// @access  Private
const cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Reçu non trouvé' });
    }

    if (receipt.status === 'cancelled') {
      return res.status(400).json({ message: 'Le reçu est déjà annulé' });
    }

    await receipt.cancel();

    res.json({
      success: true,
      data: await receipt.populate('customer sale debt issuedBy')
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation du reçu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'annulation du reçu' 
    });
  }
};

// @desc    Imprimer un reçu (générer PDF)
// @route   GET /api/receipts/:id/print
// @access  Private
const printReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('customer sale debt issuedBy');

    if (!receipt) {
      return res.status(404).json({ message: 'Reçu non trouvé' });
    }

    // Pour l'instant, on retourne les données du reçu
    // Dans une vraie implémentation, on générerait un PDF
    res.json({
      success: true,
      data: {
        receipt,
        printUrl: `/receipts/${receipt.receiptNumber}.pdf`,
        message: 'Fonction d\'impression à implémenter'
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'impression du reçu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'impression du reçu' 
    });
  }
};

module.exports = {
  generateReceipt,
  getReceipts,
  getReceiptById,
  getReceiptByNumber,
  getReceiptStats,
  cancelReceipt,
  printReceipt
};
