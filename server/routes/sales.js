const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getDailySales,
  getSalesStats,
  updateDeliveryStatus,
  updatePaymentStatus,
  getSaleById,
  cancelSale
} = require('../controllers/saleController');
const { protect } = require('../middleware/auth');

// Appliquer la protection à toutes les routes
router.use(protect);

// Routes pour les ventes
router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/stats')
  .get(getSalesStats);

router.route('/daily/:date')
  .get(getDailySales);

router.route('/:id')
  .get(getSaleById);

router.route('/:id/delivery')
  .put(updateDeliveryStatus);

router.route('/:id/payment')
  .put(updatePaymentStatus);

router.route('/:id/cancel')
  .put(cancelSale);

module.exports = router;
