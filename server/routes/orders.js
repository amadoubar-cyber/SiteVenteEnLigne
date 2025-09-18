const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Le panier doit contenir au moins un produit'),
  body('items.*.product')
    .isMongoId()
    .withMessage('ID de produit invalide'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être au moins 1'),
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis'),
  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('La ville est requise'),
  body('shippingAddress.phone')
    .matches(/^[+]?[0-9\s\-()]{8,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('paymentMethod')
    .isIn(['mobile_money', 'orange_money', 'card', 'cash_on_delivery'])
    .withMessage('Méthode de paiement invalide')
];

const statusUpdateValidation = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Statut de commande invalide'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le numéro de suivi ne peut pas dépasser 100 caractères')
];

// Routes utilisateur
router.post('/', protect, orderValidation, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Routes admin
router.get('/', protect, admin, getAllOrders);
router.get('/stats', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, statusUpdateValidation, updateOrderStatus);

module.exports = router;
