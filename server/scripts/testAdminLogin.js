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

const testAdminLogin = async () => {
  try {
    console.log('🔍 Test de connexion administrateur...\n');

    // Chercher l'admin
    const admin = await User.findOne({ email: 'admin@bowoye.gn' });
    
    if (!admin) {
      console.log('❌ Aucun administrateur trouvé avec cet email');
      return;
    }

    console.log('✅ Administrateur trouvé :');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nom: ${admin.name}`);
    console.log(`   Rôle: ${admin.role}`);
    console.log(`   Actif: ${admin.isActive}`);
    console.log(`   Email vérifié: ${admin.isEmailVerified}`);

    // Tester le mot de passe
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    if (isPasswordValid) {
      console.log('✅ Mot de passe correct !');
    } else {
      console.log('❌ Mot de passe incorrect !');
    }

    // Afficher tous les utilisateurs admin
    const allAdmins = await User.find({ role: 'admin' });
    console.log(`\n📊 Total d'administrateurs: ${allAdmins.length}`);
    allAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email} (${admin.name})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter le test
connectDB().then(() => {
  testAdminLogin();
});
