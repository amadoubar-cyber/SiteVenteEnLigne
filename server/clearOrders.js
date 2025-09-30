const mongoose = require('mongoose');
require('dotenv').config();

// Import du modèle Order
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  }
};

const clearAllOrders = async () => {
  try {
    console.log('🧹 Suppression de toutes les commandes...');
    
    // Supprimer toutes les commandes
    const result = await Order.deleteMany({});
    console.log(`✅ ${result.deletedCount} commandes supprimées`);
    
    // Vérifier
    const remaining = await Order.countDocuments();
    console.log(`📊 Commandes restantes: ${remaining}`);
    
    console.log('🎉 Nettoyage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter
connectDB().then(() => {
  clearAllOrders();
});
