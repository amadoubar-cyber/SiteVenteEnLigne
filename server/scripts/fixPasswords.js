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

const fixPasswords = async () => {
  try {
    console.log('🔧 Correction des mots de passe...\n');

    // Supprimer tous les utilisateurs de test
    await User.deleteMany({ 
      email: { 
        $in: [
          'client@koula.gn', 
          'admin@koula.gn', 
          'superadmin@koula.gn'
        ] 
      } 
    });
    console.log('🗑️  Anciens utilisateurs supprimés');

    // Créer le client (le middleware va hasher automatiquement)
    const clientUser = await User.create({
      firstName: 'Client',
      lastName: 'Test',
      email: 'client@koula.gn',
      password: 'password123',
      role: 'user',
      phone: '+224 000 000 100',
      address: {
        street: 'Rue du client',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Client créé : client@koula.gn');

    // Créer l'admin (le middleware va hasher automatiquement)
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Koula',
      email: 'admin@koula.gn',
      password: 'admin123',
      role: 'admin',
      phone: '+224 000 000 200',
      address: {
        street: 'Rue de l\'admin',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin créé : admin@koula.gn');

    // Créer le super admin (le middleware va hasher automatiquement)
    const superAdminUser = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@koula.gn',
      password: 'superadmin123',
      role: 'admin',
      phone: '+224 000 000 300',
      address: {
        street: 'Rue du super admin',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Super Admin créé : superadmin@koula.gn');

    // Tester les connexions
    console.log('\n🧪 Test des connexions...');
    
    const clientWithPassword = await User.findOne({ email: 'client@koula.gn' }).select('+password');
    const isClientValid = await bcrypt.compare('password123', clientWithPassword.password);
    console.log(`Client (client@koula.gn): ${isClientValid ? '✅' : '❌'}`);

    const adminWithPassword = await User.findOne({ email: 'admin@koula.gn' }).select('+password');
    const isAdminValid = await bcrypt.compare('admin123', adminWithPassword.password);
    console.log(`Admin (admin@koula.gn): ${isAdminValid ? '✅' : '❌'}`);

    const superAdminWithPassword = await User.findOne({ email: 'superadmin@koula.gn' }).select('+password');
    const isSuperAdminValid = await bcrypt.compare('superadmin123', superAdminWithPassword.password);
    console.log(`Super Admin (superadmin@koula.gn): ${isSuperAdminValid ? '✅' : '❌'}`);

    console.log('\n📋 Comptes de test corrigés :');
    console.log('   Client : client@koula.gn / password123');
    console.log('   Admin : admin@koula.gn / admin123');
    console.log('   Super Admin : superadmin@koula.gn / superadmin123');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la correction
connectDB().then(() => {
  fixPasswords();
});
