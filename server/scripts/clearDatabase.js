const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const ProductComparison = require('../models/ProductComparison');
const StockMovement = require('../models/StockMovement');
const Sale = require('../models/Sale');
const Debt = require('../models/Debt');
const Receipt = require('../models/Receipt');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('MongoDB connecté pour le nettoyage');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log('🧹 Nettoyage de la base de données...\n');

    // Supprimer toutes les données
    await User.deleteMany({});
    console.log('✅ Utilisateurs supprimés');

    await Category.deleteMany({});
    console.log('✅ Catégories supprimées');

    await Product.deleteMany({});
    console.log('✅ Produits supprimés');

    await Order.deleteMany({});
    console.log('✅ Commandes supprimées');

    await Quote.deleteMany({});
    console.log('✅ Devis supprimés');

    await ProductComparison.deleteMany({});
    console.log('✅ Comparaisons supprimées');

    await StockMovement.deleteMany({});
    console.log('✅ Mouvements de stock supprimés');

    await Sale.deleteMany({});
    console.log('✅ Ventes supprimées');

    await Debt.deleteMany({});
    console.log('✅ Dettes supprimées');

    await Receipt.deleteMany({});
    console.log('✅ Reçus supprimés');

    console.log('\n🎯 Base de données complètement vidée !');
    console.log('   L\'application commencera maintenant avec des données vides.');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter le nettoyage
connectDB().then(() => {
  clearDatabase();
});
