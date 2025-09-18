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

const createCorrectAdmins = async () => {
  try {
    console.log('👤 Création des administrateurs corrects...\n');

    // Supprimer les anciens admins
    await User.deleteMany({ email: { $in: ['admin@bowoye.gn', 'admin@koula.gn', 'superadmin@koula.gn'] } });
    console.log('🗑️  Anciens administrateurs supprimés');

    // Créer l'admin principal
    const hashedPassword1 = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Koula',
      email: 'admin@koula.gn',
      password: hashedPassword1,
      role: 'admin',
      phone: '+224 000 000 000',
      address: {
        street: 'Rue principale',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin créé : admin@koula.gn');

    // Créer le super admin
    const hashedPassword2 = await bcrypt.hash('superadmin123', 12);
    const superAdminUser = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@koula.gn',
      password: hashedPassword2,
      role: 'admin',
      phone: '+224 000 000 001',
      address: {
        street: 'Rue principale',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Super Admin créé : superadmin@koula.gn');

    // Tester les connexions
    console.log('\n🧪 Test des connexions...');
    
    const adminWithPassword = await User.findOne({ email: 'admin@koula.gn' }).select('+password');
    const isAdminValid = await bcrypt.compare('admin123', adminWithPassword.password);
    console.log(`Admin (admin@koula.gn): ${isAdminValid ? '✅' : '❌'}`);

    const superAdminWithPassword = await User.findOne({ email: 'superadmin@koula.gn' }).select('+password');
    const isSuperAdminValid = await bcrypt.compare('superadmin123', superAdminWithPassword.password);
    console.log(`Super Admin (superadmin@koula.gn): ${isSuperAdminValid ? '✅' : '❌'}`);

    console.log('\n📋 Identifiants de connexion :');
    console.log('   Admin : admin@koula.gn / admin123');
    console.log('   Super Admin : superadmin@koula.gn / superadmin123');

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la création
connectDB().then(() => {
  createCorrectAdmins();
});
