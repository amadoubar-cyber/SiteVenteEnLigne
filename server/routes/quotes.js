const express = require('express');
const router = express.Router();
const {
  createQuote,
  getMyQuotes,
  getQuoteById,
  getAllQuotes,
  updateQuoteStatus,
  getQuoteStats
} = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation pour la création de devis
const createQuoteValidation = [
  body('customer.name').notEmpty().withMessage('Le nom du client est requis'),
  body('customer.email').isEmail().withMessage('Email invalide'),
  body('products').isArray({ min: 1 }).withMessage('Au moins un produit est requis'),
  body('products.*.product').isMongoId().withMessage('ID produit invalide'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('products.*.unitPrice').isFloat({ min: 0 }).withMessage('Prix unitaire invalide')
];

// Routes publiques
router.post('/', createQuoteValidation, createQuote);

// Routes protégées
router.use(protect);

router.get('/my-quotes', getMyQuotes);
router.get('/:id', getQuoteById);

// Routes admin
router.use(admin);

router.get('/', getAllQuotes);
router.put('/:id/status', updateQuoteStatus);
router.get('/stats/overview', getQuoteStats);

module.exports = router;
