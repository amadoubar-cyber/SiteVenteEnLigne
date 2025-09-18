const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  try {
    console.log('🔄 Création du compte administrateur...');
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@koula.gn' });
    if (existingAdmin) {
      console.log('✅ Compte admin existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('🔐 Rôle:', existingAdmin.role);
      return;
    }
    
    // Créer le mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Créer l'utilisateur admin
    const admin = new User({
      firstName: 'Admin',
      lastName: 'Koula',
      email: 'admin@koula.gn',
      password: hashedPassword,
      role: 'admin',
      phone: '+224 123 456 789',
      address: {
        street: 'Administration Koula',
        city: 'Conakry',
        country: 'Guinée'
      },
      isEmailVerified: true
    });
    
    await admin.save();
    
    console.log('✅ Compte administrateur créé avec succès !');
    console.log('📧 Email: admin@koula.gn');
    console.log('🔑 Mot de passe: admin123');
    console.log('👤 Nom: Admin Koula');
    console.log('🔐 Rôle: admin');
    console.log('📱 Téléphone: +224 123 456 789');
    console.log('🏠 Adresse: Administration Koula, Conakry, Guinée');
    
    console.log('\n🌐 Pour vous connecter:');
    console.log('1. Allez sur: http://localhost:3000/login');
    console.log('2. Ou directement: http://localhost:3000/admin');
    console.log('3. Utilisez les identifiants ci-dessus');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter la création
createAdmin();
