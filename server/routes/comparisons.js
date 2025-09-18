const express = require('express');
const router = express.Router();
const {
  getMyComparisons,
  addToComparison,
  removeFromComparison,
  clearComparison
} = require('../controllers/comparisonController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Validation pour l'ajout à la comparaison
const addToComparisonValidation = [
  body('productId').isMongoId().withMessage('ID produit invalide')
];

router.get('/', getMyComparisons);
router.post('/add', addToComparisonValidation, addToComparison);
router.delete('/remove/:productId', removeFromComparison);
router.delete('/clear', clearComparison);

module.exports = router;
