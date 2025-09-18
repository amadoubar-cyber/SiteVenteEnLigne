const ProductComparison = require('../models/ProductComparison');
const Product = require('../models/Product');

// @desc    Obtenir les comparaisons de l'utilisateur
// @route   GET /api/comparisons
// @access  Private
const getMyComparisons = async (req, res) => {
  try {
    const comparisons = await ProductComparison.find({ user: req.user.id })
      .populate('products', 'name images price brand specifications')
      .sort({ lastModified: -1 });

    res.json({
      success: true,
      data: { comparisons }
    });
  } catch (error) {
    console.error('Erreur récupération comparaisons:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des comparaisons'
    });
  }
};

// @desc    Ajouter un produit à la comparaison
// @route   POST /api/comparisons/add
// @access  Private
const addToComparison = async (req, res) => {
  try {
    const { productId } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Trouver ou créer une comparaison pour ce type de produit
    let comparison = await ProductComparison.findOne({
      user: req.user.id,
      comparisonType: product.productType
    });

    if (!comparison) {
      comparison = await ProductComparison.create({
        user: req.user.id,
        products: [productId],
        comparisonType: product.productType
      });
    } else {
      // Vérifier si le produit n'est pas déjà dans la comparaison
      if (comparison.products.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Produit déjà dans la comparaison'
        });
      }

      // Vérifier la limite de 4 produits
      if (comparison.products.length >= 4) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 4 produits peuvent être comparés simultanément'
        });
      }

      comparison.addProduct(productId);
      await comparison.save();
    }

    // Récupérer la comparaison mise à jour
    const updatedComparison = await ProductComparison.findById(comparison._id)
      .populate('products', 'name images price brand specifications');

    res.json({
      success: true,
      message: 'Produit ajouté à la comparaison',
      data: { comparison: updatedComparison }
    });
  } catch (error) {
    console.error('Erreur ajout à la comparaison:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout à la comparaison'
    });
  }
};

// @desc    Retirer un produit de la comparaison
// @route   DELETE /api/comparisons/remove/:productId
// @access  Private
const removeFromComparison = async (req, res) => {
  try {
    const { productId } = req.params;

    const comparison = await ProductComparison.findOne({
      user: req.user.id,
      products: productId
    });

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans la comparaison'
      });
    }

    comparison.removeProduct(productId);
    await comparison.save();

    // Récupérer la comparaison mise à jour
    const updatedComparison = await ProductComparison.findById(comparison._id)
      .populate('products', 'name images price brand specifications');

    res.json({
      success: true,
      message: 'Produit retiré de la comparaison',
      data: { comparison: updatedComparison }
    });
  } catch (error) {
    console.error('Erreur suppression de la comparaison:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la comparaison'
    });
  }
};

// @desc    Vider la comparaison
// @route   DELETE /api/comparisons/clear
// @access  Private
const clearComparison = async (req, res) => {
  try {
    const { comparisonType } = req.body;

    let filter = { user: req.user.id };
    if (comparisonType) {
      filter.comparisonType = comparisonType;
    }

    await ProductComparison.deleteMany(filter);

    res.json({
      success: true,
      message: 'Comparaison vidée avec succès'
    });
  } catch (error) {
    console.error('Erreur vidage comparaison:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du vidage de la comparaison'
    });
  }
};

module.exports = {
  getMyComparisons,
  addToComparison,
  removeFromComparison,
  clearComparison
};
