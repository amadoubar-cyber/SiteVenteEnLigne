/**
 * Script de correction de la base de données
 * Nettoie les comptes problématiques et crée des comptes de test
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import du modèle User
const User = require('./models/User');

async function fixDatabase() {
  try {
    console.log('🔍 Connexion à MongoDB...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('✅ Connecté à MongoDB');
    
    // 1. Nettoyer les comptes problématiques
    console.log('\n🧹 NETTOYAGE DES COMPTES...');
    
    // Supprimer les comptes de test
    const testEmails = ['test@test.com', 'admin@test.com', 'demo@demo.com'];
    const deletedTest = await User.deleteMany({ email: { $in: testEmails } });
    console.log(`✅ ${deletedTest.deletedCount} comptes de test supprimés`);
    
    // Supprimer les comptes non vérifiés anciens
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deletedUnverified = await User.deleteMany({ 
      isVerified: false, 
      createdAt: { $lt: sevenDaysAgo } 
    });
    console.log(`✅ ${deletedUnverified.deletedCount} comptes non vérifiés anciens supprimés`);
    
    // 2. Créer des comptes fonctionnels
    console.log('\n👤 CRÉATION DE COMPTES DE TEST...');
    
    // Compte Admin
    const adminEmail = 'admin@bowoye.com';
    const adminPassword = 'admin123';
    
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        name: 'Administrateur Bowoye',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        isVerified: true,
        phone: '+224 123 456 789'
      });
      await admin.save();
      console.log(`✅ Compte admin créé: ${adminEmail} / ${adminPassword}`);
    } else {
      // Mettre à jour le mot de passe
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      admin.password = hashedAdminPassword;
      admin.isVerified = true;
      await admin.save();
      console.log(`✅ Compte admin mis à jour: ${adminEmail} / ${adminPassword}`);
    }
    
    // Compte Client
    const clientEmail = 'client@bowoye.com';
    const clientPassword = 'client123';
    
    let client = await User.findOne({ email: clientEmail });
    if (!client) {
      const hashedClientPassword = await bcrypt.hash(clientPassword, 10);
      client = new User({
        name: 'Client Test',
        email: clientEmail,
        password: hashedClientPassword,
        role: 'user',
        isVerified: true,
        phone: '+224 987 654 321'
      });
      await client.save();
      console.log(`✅ Compte client créé: ${clientEmail} / ${clientPassword}`);
    } else {
      // Mettre à jour le mot de passe
      const hashedClientPassword = await bcrypt.hash(clientPassword, 10);
      client.password = hashedClientPassword;
      client.isVerified = true;
      await client.save();
      console.log(`✅ Compte client mis à jour: ${clientEmail} / ${clientPassword}`);
    }
    
    // 3. Lister tous les comptes
    console.log('\n📋 COMPTES DISPONIBLES:');
    const allUsers = await User.find({});
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - Vérifié: ${user.isVerified}`);
    });
    
    console.log('\n🎯 COMPTES DE TEST FONCTIONNELS:');
    console.log('👨‍💼 Admin: admin@bowoye.com / admin123');
    console.log('👤 Client: client@bowoye.com / client123');
    
    console.log('\n✅ Base de données nettoyée et prête !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
fixDatabase();
