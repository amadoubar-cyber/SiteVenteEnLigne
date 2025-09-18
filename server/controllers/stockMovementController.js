const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');

// Créer un nouveau mouvement de stock
const createStockMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason, notes, images } = req.body;
    const userId = req.user.id;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé' 
      });
    }

    // Vérifier le stock pour les sorties
    if (type === 'out' && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock disponible: ${product.stock}`
      });
    }

    // Créer le mouvement
    const stockMovement = new StockMovement({
      productId,
      productName: product.name,
      category: product.category,
      type,
      quantity,
      reason,
      notes,
      images: images || [],
      createdBy: userId
    });

    await stockMovement.save();

    // Mettre à jour le stock du produit
    const stockChange = type === 'in' ? quantity : -quantity;
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: stockChange } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Mouvement de stock créé avec succès',
      data: stockMovement
    });
  } catch (error) {
    console.error('Erreur création mouvement stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du mouvement de stock'
    });
  }
};

// Récupérer tous les mouvements de stock
const getStockMovements = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      type, 
      productId,
      startDate,
      endDate 
    } = req.query;

    // Construire le filtre
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (productId) filter.productId = productId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'productId', select: 'name category stock price' },
        { path: 'createdBy', select: 'firstName lastName email' }
      ]
    };

    const movements = await StockMovement.paginate(filter, options);

    res.json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error('Erreur récupération mouvements stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des mouvements de stock'
    });
  }
};

// Récupérer un mouvement de stock par ID
const getStockMovementById = async (req, res) => {
  try {
    const { id } = req.params;

    const movement = await StockMovement.findById(id)
      .populate('productId', 'name category stock price')
      .populate('createdBy', 'firstName lastName email');

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    res.json({
      success: true,
      data: movement
    });
  } catch (error) {
    console.error('Erreur récupération mouvement stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du mouvement de stock'
    });
  }
};

// Mettre à jour un mouvement de stock
const updateStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, reason, notes, images } = req.body;

    const movement = await StockMovement.findById(id);
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    // Récupérer le produit
    const product = await Product.findById(movement.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Calculer la différence de stock
    const oldStockChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
    const newStockChange = type === 'in' ? quantity : -quantity;
    const stockDifference = newStockChange - oldStockChange;

    // Vérifier le stock pour les sorties
    if (type === 'out' && (product.stock + stockDifference) < 0) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock disponible: ${product.stock}`
      });
    }

    // Mettre à jour le mouvement
    const updatedMovement = await StockMovement.findByIdAndUpdate(
      id,
      {
        type,
        quantity,
        reason,
        notes,
        images: images || movement.images
      },
      { new: true }
    ).populate('productId', 'name category stock price')
     .populate('createdBy', 'firstName lastName email');

    // Mettre à jour le stock du produit
    await Product.findByIdAndUpdate(
      movement.productId,
      { $inc: { stock: stockDifference } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Mouvement de stock mis à jour avec succès',
      data: updatedMovement
    });
  } catch (error) {
    console.error('Erreur mise à jour mouvement stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mouvement de stock'
    });
  }
};

// Supprimer un mouvement de stock
const deleteStockMovement = async (req, res) => {
  try {
    const { id } = req.params;

    const movement = await StockMovement.findById(id);
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    // Récupérer le produit
    const product = await Product.findById(movement.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Calculer le changement de stock à annuler
    const stockChange = movement.type === 'in' ? -movement.quantity : movement.quantity;

    // Vérifier le stock pour les annulations de sorties
    if (movement.type === 'out' && (product.stock + stockChange) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer ce mouvement. Stock insuffisant pour l\'annulation.'
      });
    }

    // Supprimer le mouvement
    await StockMovement.findByIdAndDelete(id);

    // Mettre à jour le stock du produit
    await Product.findByIdAndUpdate(
      movement.productId,
      { $inc: { stock: stockChange } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Mouvement de stock supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression mouvement stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du mouvement de stock'
    });
  }
};

// Récupérer les statistiques des mouvements de stock
const getStockMovementStats = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    // Construire le filtre
    const filter = {};
    if (category) filter.category = category;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Statistiques générales
    const totalMovements = await StockMovement.countDocuments(filter);
    
    const inMovements = await StockMovement.aggregate([
      { $match: { ...filter, type: 'in' } },
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' }, count: { $sum: 1 } } }
    ]);

    const outMovements = await StockMovement.aggregate([
      { $match: { ...filter, type: 'out' } },
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' }, count: { $sum: 1 } } }
    ]);

    // Statistiques par catégorie
    const categoryStats = await StockMovement.aggregate([
      { $match: filter },
      { $group: { 
        _id: '$category', 
        totalMovements: { $sum: 1 },
        inQuantity: { 
          $sum: { $cond: [{ $eq: ['$type', 'in'] }, '$quantity', 0] }
        },
        outQuantity: { 
          $sum: { $cond: [{ $eq: ['$type', 'out'] }, '$quantity', 0] }
        }
      }}
    ]);

    // Mouvements récents
    const recentMovements = await StockMovement.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productId', 'name category')
      .populate('createdBy', 'firstName lastName');

    res.json({
      success: true,
      data: {
        totalMovements,
        inMovements: inMovements[0] || { totalQuantity: 0, count: 0 },
        outMovements: outMovements[0] || { totalQuantity: 0, count: 0 },
        categoryStats,
        recentMovements
      }
    });
  } catch (error) {
    console.error('Erreur statistiques mouvements stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement,
  getStockMovementStats
};

