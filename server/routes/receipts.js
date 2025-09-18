const express = require('express');
const router = express.Router();
const {
  generateReceipt,
  getReceipts,
  getReceiptById,
  getReceiptByNumber,
  getReceiptStats,
  cancelReceipt,
  printReceipt
} = require('../controllers/receiptController');
const { protect } = require('../middleware/auth');

// Appliquer la protection à toutes les routes
router.use(protect);

// Routes pour les reçus
router.route('/')
  .get(getReceipts)
  .post(generateReceipt);

router.route('/stats')
  .get(getReceiptStats);

router.route('/number/:number')
  .get(getReceiptByNumber);

router.route('/:id')
  .get(getReceiptById);

router.route('/:id/cancel')
  .put(cancelReceipt);

router.route('/:id/print')
  .get(printReceipt);

module.exports = router;
