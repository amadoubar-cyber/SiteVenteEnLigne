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

const diagnoseUsers = async () => {
  try {
    console.log('🔍 Diagnostic des utilisateurs...\n');

    // Lister tous les utilisateurs
    const allUsers = await User.find({});
    console.log(`📊 Total d'utilisateurs: ${allUsers.length}\n`);

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   Actif: ${user.isActive}`);
      console.log(`   Email vérifié: ${user.isEmailVerified}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

    // Tester les connexions spécifiques
    const testAccounts = [
      { email: 'client@koula.gn', password: 'password123' },
      { email: 'admin@koula.gn', password: 'admin123' },
      { email: 'superadmin@koula.gn', password: 'superadmin123' }
    ];

    console.log('🧪 Test des connexions...\n');

    for (const account of testAccounts) {
      const user = await User.findOne({ email: account.email }).select('+password');
      
      if (!user) {
        console.log(`❌ ${account.email}: Utilisateur non trouvé`);
        continue;
      }

      console.log(`👤 ${account.email}:`);
      console.log(`   Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   Actif: ${user.isActive}`);
      console.log(`   Email vérifié: ${user.isEmailVerified}`);
      
      if (user.password) {
        const isPasswordValid = await bcrypt.compare(account.password, user.password);
        console.log(`   Mot de passe: ${isPasswordValid ? '✅ Valide' : '❌ Invalide'}`);
      } else {
        console.log(`   Mot de passe: ❌ Non défini`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter le diagnostic
connectDB().then(() => {
  diagnoseUsers();
});
