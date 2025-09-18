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

const recreateAdmin = async () => {
  try {
    console.log('🔄 Recréation de l\'administrateur...\n');

    // Supprimer l'ancien admin
    await User.deleteOne({ email: 'admin@bowoye.gn' });
    console.log('🗑️  Ancien administrateur supprimé');

    // Créer le nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Bowoye',
      email: 'admin@bowoye.gn',
      password: hashedPassword,
      role: 'admin',
      phone: '+224 000 000 000',
      address: 'Conakry, Guinée',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Nouvel administrateur créé avec succès !');
    console.log('📧 Email: admin@bowoye.gn');
    console.log('🔑 Mot de passe: admin123');
    console.log('👤 Nom: Admin Bowoye');

    // Tester la connexion en récupérant l'admin avec le mot de passe
    const adminWithPassword = await User.findOne({ email: 'admin@bowoye.gn' }).select('+password');
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, adminWithPassword.password);
    
    if (isPasswordValid) {
      console.log('✅ Test de mot de passe réussi !');
    } else {
      console.log('❌ Test de mot de passe échoué !');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la recréation:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la recréation
connectDB().then(() => {
  recreateAdmin();
});
