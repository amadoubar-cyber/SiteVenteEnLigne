const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Obtenir tous les produits avec filtres
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      featured,
      productType,
      brand
    } = req.query;

    // Construction du filtre
    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (productType) {
      filter.productType = productType;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    // Construction du tri
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Calcul de la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Exécution de la requête
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits'
    });
  }
};

// @desc    Obtenir un produit par ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('reviews.user', 'firstName lastName');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit'
    });
  }
};

// @desc    Obtenir les produits recommandés
// @route   GET /api/products/recommended/:id
// @access  Public
const getRecommendedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    const recommendedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .populate('category', 'name')
    .limit(4)
    .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      data: { products: recommendedProducts }
    });
  } catch (error) {
    console.error('Erreur récupération produits recommandés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits recommandés'
    });
  }
};

// @desc    Créer un nouveau produit
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const productData = req.body;
    productData.vendor = req.user.id;

    const product = await Product.create(productData);

    // Ajouter le produit à la catégorie
    await Category.findByIdAndUpdate(
      product.category,
      { $push: { products: product._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit'
    });
  }
};

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si l'utilisateur est le vendeur ou admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce produit'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit'
    });
  }
};

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si l'utilisateur est le vendeur ou admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce produit'
      });
    }

    // Supprimer le produit de la catégorie
    await Category.findByIdAndUpdate(
      product.category,
      { $pull: { products: product._id } }
    );

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit'
    });
  }
};

// @desc    Ajouter un avis sur un produit
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis sur ce produit'
      });
    }

    // Ajouter l'avis
    const review = {
      user: req.user.id,
      rating,
      comment
    };

    product.reviews.push(review);
    product.updateRating();
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      data: { review }
    });
  } catch (error) {
    console.error('Erreur ajout avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout de l\'avis'
    });
  }
};

// @desc    Rechercher des produits
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12, category, minPrice, maxPrice, sort = 'createdAt', order = 'desc' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }

    // Construction du filtre de recherche
    let filter = { 
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Filtres additionnels
    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Calcul de la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construction du tri
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Exécution de la recherche
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des produits'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  searchProducts
};
