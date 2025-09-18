const express = require('express');
const router = express.Router();
const {
  createDebt,
  getDebts,
  getDebtStats,
  recordPayment,
  getDebtById,
  updateDebt,
  cancelDebt
} = require('../controllers/debtController');
const { protect } = require('../middleware/auth');

// Appliquer la protection à toutes les routes
router.use(protect);

// Routes pour les dettes
router.route('/')
  .get(getDebts)
  .post(createDebt);

router.route('/stats')
  .get(getDebtStats);

router.route('/:id')
  .get(getDebtById)
  .put(updateDebt);

router.route('/:id/payment')
  .post(recordPayment);

router.route('/:id/cancel')
  .put(cancelDebt);

module.exports = router;
