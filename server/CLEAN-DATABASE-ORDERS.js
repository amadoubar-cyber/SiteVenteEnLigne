/**
 * Script pour nettoyer la base de données des commandes de test
 * 
 * Ce script supprime toutes les commandes de la base de données MongoDB
 * pour corriger le chiffre d'affaires
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import du modèle Order
const Order = require('./server/models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('✅ MongoDB connecté pour le nettoyage');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const cleanOrders = async () => {
  try {
    console.log('🧹 Nettoyage des commandes en cours...');
    
    // Compter les commandes avant suppression
    const orderCount = await Order.countDocuments();
    console.log(`📊 Commandes trouvées: ${orderCount}`);
    
    if (orderCount > 0) {
      // Afficher les détails des commandes avant suppression
      const orders = await Order.find({}).populate('user', 'firstName lastName email');
      console.log('\n📋 DÉTAIL DES COMMANDES À SUPPRIMER:');
      let totalRevenue = 0;
      
      orders.forEach((order, index) => {
        totalRevenue += order.total || 0;
        console.log(`Commande ${index + 1}:`, {
          id: order._id,
          total: order.total,
          status: order.orderStatus,
          user: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A',
          date: order.createdAt
        });
      });
      
      console.log(`\n💰 TOTAL CHIFFRE D'AFFAIRES: ${totalRevenue.toLocaleString('fr-FR')} FG`);
      
      // Supprimer toutes les commandes
      const result = await Order.deleteMany({});
      console.log(`\n✅ ${result.deletedCount} commandes supprimées`);
    } else {
      console.log('✅ Aucune commande trouvée - base de données déjà propre');
    }
    
    // Vérifier l'état final
    const finalCount = await Order.countDocuments();
    console.log(`📊 Commandes restantes: ${finalCount}`);
    
    console.log('\n🎉 NETTOYAGE TERMINÉ !');
    console.log('💡 Le chiffre d\'affaires devrait maintenant afficher 0 FG');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le nettoyage
connectDB().then(() => {
  cleanOrders();
});
