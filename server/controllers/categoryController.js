const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Obtenir toutes les catégories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('products', 'name price images')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};

// @desc    Obtenir les catégories par type
// @route   GET /api/categories/type/:type
// @access  Public
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['construction', 'electronique'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type de catégorie invalide'
      });
    }

    const categories = await Category.find({ 
      isActive: true, 
      mainType: type 
    })
      .populate('products', 'name price images')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Erreur récupération catégories par type:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};

// @desc    Obtenir une catégorie par ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'products',
        match: { isActive: true },
        select: 'name price images rating stock'
      });

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Erreur récupération catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la catégorie'
    });
  }
};

// @desc    Créer une nouvelle catégorie
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: { category }
    });
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la catégorie'
    });
  }
};

// @desc    Mettre à jour une catégorie
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: { category }
    });
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la catégorie'
    });
  }
};

// @desc    Supprimer une catégorie
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Vérifier s'il y a des produits dans cette catégorie
    const productsCount = await Product.countDocuments({ category: category._id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer la catégorie. ${productsCount} produit(s) associé(s).`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la catégorie'
    });
  }
};

// @desc    Obtenir les statistiques des catégories
// @route   GET /api/categories/stats
// @access  Private/Admin
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' },
          activeProducts: {
            $size: {
              $filter: {
                input: '$products',
                cond: { $eq: ['$$this.isActive', true] }
              }
            }
          }
        }
      },
      {
        $sort: { productCount: -1 }
      }
    ]);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Erreur récupération stats catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  getCategories,
  getCategoriesByType,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};
