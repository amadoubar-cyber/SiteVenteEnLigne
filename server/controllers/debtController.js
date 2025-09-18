const Debt = require('../models/Debt');
const Sale = require('../models/Sale');
const Receipt = require('../models/Receipt');
const { protect } = require('../middleware/auth');

// @desc    Créer une nouvelle dette
// @route   POST /api/debts
// @access  Private
const createDebt = async (req, res) => {
  try {
    const {
      saleId,
      dueDate,
      paymentMethod,
      notes
    } = req.body;

    // Vérifier que la vente existe
    const sale = await Sale.findById(saleId).populate('customer');
    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    // Vérifier que la vente n'a pas déjà une dette
    const existingDebt = await Debt.findOne({ sale: saleId });
    if (existingDebt) {
      return res.status(400).json({ message: 'Cette vente a déjà une dette enregistrée' });
    }

    // Créer la dette
    const debt = new Debt({
      sale: saleId,
      customer: sale.customer._id,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      customerAddress: sale.delivery.address,
      totalAmount: sale.totalPrice + (sale.delivery.deliveryPrice || 0),
      remainingAmount: sale.totalPrice + (sale.delivery.deliveryPrice || 0),
      dueDate: new Date(dueDate),
      paymentMethod,
      notes,
      createdBy: req.user.id
    });

    await debt.save();

    // Mettre à jour le statut de la vente
    sale.payment.status = 'pending';
    await sale.save();

    // Générer un reçu initial
    const receipt = new Receipt({
      sale: saleId,
      debt: debt._id,
      customer: sale.customer._id,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      customerAddress: sale.delivery.address,
      receiptType: 'sale',
      totalAmount: debt.totalAmount,
      paidAmount: 0,
      items: [{
        productName: sale.productName,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        totalPrice: sale.totalPrice,
        category: sale.productCategory
      }],
      paymentMethod,
      delivery: sale.delivery,
      notes,
      issuedBy: req.user.id
    });

    await receipt.save();

    res.status(201).json({
      success: true,
      data: {
        debt: await debt.populate('customer sale createdBy'),
        receipt
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la dette:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la création de la dette' 
    });
  }
};

// @desc    Obtenir toutes les dettes
// @route   GET /api/debts
// @access  Private
const getDebts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      customer,
      startDate,
      endDate
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (status) filter.status = status;
    if (customer) filter.customer = customer;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: 'customer sale createdBy'
    };

    const debts = await Debt.paginate(filter, options);

    res.json({
      success: true,
      data: debts
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des dettes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des dettes' 
    });
  }
};

// @desc    Obtenir les statistiques des dettes
// @route   GET /api/debts/stats
// @access  Private
const getDebtStats = async (req, res) => {
  try {
    const stats = await Debt.getDebtStats();
    
    // Obtenir les dettes en retard
    const overdueDebts = await Debt.getOverdueDebts();
    
    // Calculer les totaux
    const totalDebts = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalAmount = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
    const totalPaid = stats.reduce((sum, stat) => sum + stat.paidAmount, 0);
    const totalRemaining = stats.reduce((sum, stat) => sum + stat.remainingAmount, 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalDebts,
          totalAmount,
          totalPaid,
          totalRemaining,
          overdueCount: overdueDebts.length
        },
        byStatus: stats,
        overdueDebts: overdueDebts.slice(0, 10) // Limiter à 10 pour l'affichage
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

// @desc    Enregistrer un paiement
// @route   POST /api/debts/:id/payment
// @access  Private
const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    const debt = await Debt.findById(id);
    if (!debt) {
      return res.status(404).json({ message: 'Dette non trouvée' });
    }

    if (amount > debt.remainingAmount) {
      return res.status(400).json({ 
        message: `Le montant ne peut pas dépasser ${debt.remainingAmount} FCFA` 
      });
    }

    // Ajouter le paiement
    const paymentData = {
      amount,
      paymentMethod,
      notes,
      receivedBy: req.user.id
    };

    await debt.addPayment(paymentData);

    // Générer un reçu de paiement
    const receipt = new Receipt({
      sale: debt.sale,
      debt: debt._id,
      customer: debt.customer,
      customerName: debt.customerName,
      customerPhone: debt.customerPhone,
      customerAddress: debt.customerAddress,
      receiptType: debt.remainingAmount <= 0 ? 'payment' : 'partial_payment',
      totalAmount: debt.totalAmount,
      paidAmount: debt.paidAmount,
      remainingAmount: debt.remainingAmount,
      items: [{
        productName: 'Paiement partiel',
        quantity: 1,
        unitPrice: amount,
        totalPrice: amount,
        category: 'payment'
      }],
      paymentMethod,
      notes,
      issuedBy: req.user.id
    });

    await receipt.save();

    res.json({
      success: true,
      data: {
        debt: await debt.populate('customer sale createdBy'),
        receipt
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'enregistrement du paiement' 
    });
  }
};

// @desc    Obtenir une dette par ID
// @route   GET /api/debts/:id
// @access  Private
const getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id)
      .populate('customer sale createdBy payments.receivedBy');

    if (!debt) {
      return res.status(404).json({ message: 'Dette non trouvée' });
    }

    res.json({
      success: true,
      data: debt
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la dette:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération de la dette' 
    });
  }
};

// @desc    Mettre à jour une dette
// @route   PUT /api/debts/:id
// @access  Private
const updateDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate, notes, internalNotes } = req.body;

    const debt = await Debt.findById(id);
    if (!debt) {
      return res.status(404).json({ message: 'Dette non trouvée' });
    }

    if (dueDate) debt.dueDate = new Date(dueDate);
    if (notes !== undefined) debt.notes = notes;
    if (internalNotes !== undefined) debt.internalNotes = internalNotes;
    debt.updatedBy = req.user.id;

    await debt.save();

    res.json({
      success: true,
      data: await debt.populate('customer sale createdBy')
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dette:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la mise à jour de la dette' 
    });
  }
};

// @desc    Annuler une dette
// @route   PUT /api/debts/:id/cancel
// @access  Private
const cancelDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) {
      return res.status(404).json({ message: 'Dette non trouvée' });
    }

    if (debt.status === 'paid') {
      return res.status(400).json({ message: 'Impossible d\'annuler une dette payée' });
    }

    debt.status = 'cancelled';
    debt.updatedBy = req.user.id;
    await debt.save();

    res.json({
      success: true,
      data: await debt.populate('customer sale createdBy')
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la dette:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'annulation de la dette' 
    });
  }
};

module.exports = {
  createDebt,
  getDebts,
  getDebtStats,
  recordPayment,
  getDebtById,
  updateDebt,
  cancelDebt
};
