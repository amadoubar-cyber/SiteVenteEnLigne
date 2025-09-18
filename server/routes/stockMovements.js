const express = require('express');
const router = express.Router();
const {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement,
  getStockMovementStats
} = require('../controllers/stockMovementController');
const { protect } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les mouvements de stock
router.post('/', createStockMovement);
router.get('/', getStockMovements);
router.get('/stats', getStockMovementStats);
router.get('/:id', getStockMovementById);
router.put('/:id', updateStockMovement);
router.delete('/:id', deleteStockMovement);

module.exports = router;

