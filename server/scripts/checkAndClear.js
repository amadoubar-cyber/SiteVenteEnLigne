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
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const checkAndClear = async () => {
  try {
    console.log('🔍 Vérification de la base de données...\n');

    // Compter les documents
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const quoteCount = await Quote.countDocuments();
    const comparisonCount = await ProductComparison.countDocuments();
    const stockMovementCount = await StockMovement.countDocuments();
    const saleCount = await Sale.countDocuments();
    const debtCount = await Debt.countDocuments();
    const receiptCount = await Receipt.countDocuments();

    console.log('📊 État actuel de la base de données :');
    console.log(`   Utilisateurs: ${userCount}`);
    console.log(`   Catégories: ${categoryCount}`);
    console.log(`   Produits: ${productCount}`);
    console.log(`   Commandes: ${orderCount}`);
    console.log(`   Devis: ${quoteCount}`);
    console.log(`   Comparaisons: ${comparisonCount}`);
    console.log(`   Mouvements de stock: ${stockMovementCount}`);
    console.log(`   Ventes: ${saleCount}`);
    console.log(`   Dettes: ${debtCount}`);
    console.log(`   Reçus: ${receiptCount}`);

    if (userCount > 0 || categoryCount > 0 || productCount > 0 || orderCount > 0 || 
        quoteCount > 0 || comparisonCount > 0 || stockMovementCount > 0 || 
        saleCount > 0 || debtCount > 0 || receiptCount > 0) {
      
      console.log('\n🧹 Nettoyage de la base de données...');
      
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
    } else {
      console.log('\n✅ Base de données déjà vide !');
    }

    // Créer un admin de base
    console.log('\n👤 Création de l\'administrateur de base...');
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await User.create({
        firstName: 'Admin',
        lastName: 'Bowoye',
        name: 'Administrateur',
        email: 'admin@bowoye.gn',
        password: hashedPassword,
        role: 'admin',
        phone: '+224 000 000 000',
        address: 'Conakry, Guinée',
        isEmailVerified: true,
        isActive: true
      });

      console.log('✅ Administrateur créé !');
      console.log('📧 Email: admin@bowoye.gn');
      console.log('🔑 Mot de passe: admin123');
    } else {
      console.log('⚠️  Administrateur existe déjà');
    }

    console.log('\n🚀 Application prête avec des données vides !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter
connectDB().then(() => {
  checkAndClear();
});
