const Quote = require('../models/Quote');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Créer un nouveau devis
// @route   POST /api/quotes
// @access  Public
const createQuote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { customer, products, notes } = req.body;

    // Vérifier que tous les produits existent
    const productIds = products.map(p => p.product);
    const existingProducts = await Product.find({ 
      _id: { $in: productIds },
      isActive: true 
    });

    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Certains produits ne sont pas disponibles'
      });
    }

    // Calculer le total
    let totalAmount = 0;
    const quoteProducts = products.map(item => {
      const product = existingProducts.find(p => p._id.toString() === item.product);
      const totalPrice = item.quantity * item.unitPrice;
      totalAmount += totalPrice;
      
      return {
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: totalPrice
      };
    });

    // Créer le devis
    const quoteData = {
      customer,
      products: quoteProducts,
      totalAmount,
      notes,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      user: req.user?.id
    };

    const quote = await Quote.create(quoteData);

    res.status(201).json({
      success: true,
      message: 'Devis créé avec succès',
      data: { quote }
    });
  } catch (error) {
    console.error('Erreur création devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du devis'
    });
  }
};

// @desc    Obtenir les devis de l'utilisateur
// @route   GET /api/quotes/my-quotes
// @access  Private
const getMyQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = { user: req.user.id };
    if (status) {
      filter.status = status;
    }

    const quotes = await Quote.find(filter)
      .populate('products.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments(filter);

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalQuotes: total,
          hasNext: skip + quotes.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des devis'
    });
  }
};

// @desc    Obtenir un devis par ID
// @route   GET /api/quotes/:id
// @access  Private
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('products.product', 'name images price description')
      .populate('user', 'firstName lastName email');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }

    // Vérifier que l'utilisateur peut accéder à ce devis
    if (quote.user && quote.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce devis'
      });
    }

    res.json({
      success: true,
      data: { quote }
    });
  } catch (error) {
    console.error('Erreur récupération devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du devis'
    });
  }
};

// @desc    Obtenir tous les devis (Admin)
// @route   GET /api/quotes
// @access  Private/Admin
const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { quoteNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await Quote.find(filter)
      .populate('products.product', 'name images price')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments(filter);

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalQuotes: total,
          hasNext: skip + quotes.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des devis'
    });
  }
};

// @desc    Mettre à jour le statut d'un devis
// @route   PUT /api/quotes/:id/status
// @access  Private/Admin
const updateQuoteStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['pending', 'sent', 'accepted', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes: adminNotes || undefined
      },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Statut du devis mis à jour avec succès',
      data: { quote }
    });
  } catch (error) {
    console.error('Erreur mise à jour statut devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du statut'
    });
  }
};

// @desc    Obtenir les statistiques des devis
// @route   GET /api/quotes/stats
// @access  Private/Admin
const getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalQuotes = await Quote.countDocuments();
    const totalAmount = await Quote.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        totalQuotes,
        totalAmount: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createQuote,
  getMyQuotes,
  getQuoteById,
  getAllQuotes,
  updateQuoteStatus,
  getQuoteStats
};
