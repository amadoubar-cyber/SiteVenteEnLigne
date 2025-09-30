const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Order = require('./models/Order');
const Sale = require('./models/Sale');
const Debt = require('./models/Debt');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  }
};

const clearAllSalesData = async () => {
  try {
    console.log('🧹 Suppression de toutes les données de vente...');
    
    // Supprimer les commandes
    const ordersResult = await Order.deleteMany({});
    console.log(`✅ ${ordersResult.deletedCount} commandes supprimées`);
    
    // Supprimer les ventes
    const salesResult = await Sale.deleteMany({});
    console.log(`✅ ${salesResult.deletedCount} ventes supprimées`);
    
    // Supprimer les dettes
    const debtsResult = await Debt.deleteMany({});
    console.log(`✅ ${debtsResult.deletedCount} dettes supprimées`);
    
    // Vérifier
    const remainingOrders = await Order.countDocuments();
    const remainingSales = await Sale.countDocuments();
    const remainingDebts = await Debt.countDocuments();
    
    console.log(`\n📊 État final:`);
    console.log(`- Commandes restantes: ${remainingOrders}`);
    console.log(`- Ventes restantes: ${remainingSales}`);
    console.log(`- Dettes restantes: ${remainingDebts}`);
    
    console.log('\n🎉 Nettoyage complet terminé !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter
connectDB().then(() => {
  clearAllSalesData();
});
