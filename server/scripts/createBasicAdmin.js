const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const createBasicAdmin = async () => {
  try {
    console.log('👤 Création de l\'utilisateur admin de base...\n');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà');
      console.log(`   Email: ${existingAdmin.email}`);
      return;
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await User.create({
      name: 'Administrateur',
      email: 'admin@bowoye.gn',
      password: hashedPassword,
      role: 'admin',
      phone: '+224 000 000 000',
      address: 'Conakry, Guinée',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email: admin@bowoye.gn');
    console.log('🔑 Mot de passe: admin123');
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe en production !');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la création
connectDB().then(() => {
  createBasicAdmin();
});
