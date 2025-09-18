const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { protect, admin } = require('../middleware/auth');

// @desc    Créer une nouvelle vente
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  try {
    const {
      product,
      quantity,
      unitPrice,
      customer,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryPrice,
      paymentMethod,
      notes
    } = req.body;

    // Vérifier que le produit existe et a suffisamment de stock
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    if (productDoc.stock < quantity) {
      return res.status(400).json({ 
        message: `Stock insuffisant. Stock disponible: ${productDoc.stock}` 
      });
    }

    // Créer la vente
    const sale = new Sale({
      product,
      productName: productDoc.name,
      productCategory: productDoc.category,
      quantity,
      unitPrice,
      customer,
      customerName,
      customerPhone,
      delivery: {
        address: deliveryAddress,
        city: deliveryCity,
        deliveryPrice: deliveryPrice || 0
      },
      payment: {
        method: paymentMethod
      },
      soldBy: req.user.id,
      notes
    });

    await sale.save();

    // Mettre à jour le stock du produit
    productDoc.stock -= quantity;
    await productDoc.save();

    // Créer un mouvement de stock (sortie)
    const stockMovement = new StockMovement({
      product,
      productName: productDoc.name,
      category: productDoc.category,
      type: 'out',
      quantity,
      reason: `Vente - Commande #${sale._id}`,
      reference: sale._id,
      performedBy: req.user.id
    });

    await stockMovement.save();

    // Populer les références
    await sale.populate('product customer soldBy');

    res.status(201).json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Erreur lors de la création de la vente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la création de la vente' 
    });
  }
};

// @desc    Obtenir toutes les ventes
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      startDate,
      endDate,
      customer
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.productCategory = category;
    if (customer) filter.customer = customer;
    
    if (startDate || endDate) {
      filter.soldAt = {};
      if (startDate) filter.soldAt.$gte = new Date(startDate);
      if (endDate) filter.soldAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { soldAt: -1 },
      populate: 'product customer soldBy'
    };

    const sales = await Sale.paginate(filter, options);

    res.json({
      success: true,
      data: sales
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des ventes' 
    });
  }
};

// @desc    Obtenir les ventes du jour
// @route   GET /api/sales/daily/:date
// @access  Private
const getDailySales = async (req, res) => {
  try {
    const { date } = req.params;
    const sales = await Sale.getDailySales(date);

    // Calculer les statistiques du jour
    const stats = {
      totalSales: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
      totalQuantity: sales.reduce((sum, sale) => sum + sale.quantity, 0),
      totalOrders: sales.length,
      averageOrderValue: sales.length > 0 ? 
        sales.reduce((sum, sale) => sum + sale.totalPrice, 0) / sales.length : 0
    };

    res.json({
      success: true,
      data: {
        sales,
        stats
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des ventes du jour:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des ventes du jour' 
    });
  }
};

// @desc    Obtenir les statistiques des ventes
// @route   GET /api/sales/stats
// @access  Private
const getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate, period = 'day' } = req.query;

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

    const stats = await Sale.getSalesStats(start, end);
    
    // Obtenir les ventes par catégorie
    const categoryStats = await Sale.aggregate([
      {
        $match: {
          soldAt: { $gte: start, $lte: end },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$productCategory',
          totalSales: { $sum: '$totalPrice' },
          totalQuantity: { $sum: '$quantity' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Obtenir les ventes par jour
    const dailyStats = await Sale.aggregate([
      {
        $match: {
          soldAt: { $gte: start, $lte: end },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$soldAt' },
            month: { $month: '$soldAt' },
            day: { $dayOfMonth: '$soldAt' }
          },
          totalSales: { $sum: '$totalPrice' },
          totalQuantity: { $sum: '$quantity' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          totalSales: 0,
          totalQuantity: 0,
          totalOrders: 0,
          averageOrderValue: 0
        },
        byCategory: categoryStats,
        daily: dailyStats
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

// @desc    Mettre à jour le statut de livraison
// @route   PUT /api/sales/:id/delivery
// @access  Private
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryPerson } = req.body;

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    sale.delivery.status = status;
    if (deliveryPerson) sale.delivery.deliveryPerson = deliveryPerson;
    
    if (status === 'delivered') {
      sale.delivery.deliveredAt = new Date();
      sale.status = 'delivered';
    }

    await sale.save();

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de livraison:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la mise à jour du statut de livraison' 
    });
  }
};

// @desc    Mettre à jour le statut de paiement
// @route   PUT /api/sales/:id/payment
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    sale.payment.status = status;
    if (status === 'paid') {
      sale.payment.paidAt = new Date();
    }

    await sale.save();

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la mise à jour du statut de paiement' 
    });
  }
};

// @desc    Obtenir une vente par ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('product customer soldBy');

    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la vente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération de la vente' 
    });
  }
};

// @desc    Annuler une vente
// @route   PUT /api/sales/:id/cancel
// @access  Private
const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Vente non trouvée' });
    }

    if (sale.status === 'delivered') {
      return res.status(400).json({ message: 'Impossible d\'annuler une vente déjà livrée' });
    }

    // Restaurer le stock
    const product = await Product.findById(sale.product);
    if (product) {
      product.stock += sale.quantity;
      await product.save();

      // Créer un mouvement de stock (entrée)
      const stockMovement = new StockMovement({
        product: sale.product,
        productName: sale.productName,
        category: sale.productCategory,
        type: 'in',
        quantity: sale.quantity,
        reason: `Annulation de vente - Commande #${sale._id}`,
        reference: sale._id,
        performedBy: req.user.id
      });

      await stockMovement.save();
    }

    sale.status = 'cancelled';
    sale.delivery.status = 'cancelled';
    await sale.save();

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la vente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'annulation de la vente' 
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getDailySales,
  getSalesStats,
  updateDeliveryStatus,
  updatePaymentStatus,
  getSaleById,
  cancelSale
};
