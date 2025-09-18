const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategoriesByType,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la catégorie est requis')
    .isLength({ max: 50 })
    .withMessage('Le nom ne peut pas dépasser 50 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description ne peut pas dépasser 200 caractères')
];

// Routes publiques
router.get('/', getCategories);
router.get('/type/:type', getCategoriesByType);
router.get('/stats', protect, admin, getCategoryStats);
router.get('/:id', getCategoryById);

// Routes admin
router.post('/', protect, admin, categoryValidation, createCategory);
router.put('/:id', protect, admin, categoryValidation, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
