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

const createTestUsers = async () => {
  try {
    console.log('👥 Création des utilisateurs de test...\n');

    // Vérifier si les utilisateurs existent déjà
    const existingAdmin = await User.findOne({ email: 'admin@bowoye.gn' });
    const existingClient = await User.findOne({ email: 'client@bowoye.gn' });

    if (existingAdmin) {
      console.log('⚠️  Administrateur existe déjà');
    } else {
      // Créer l'administrateur
      const adminPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        firstName: 'Admin',
        lastName: 'Bowoye',
        name: 'Administrateur',
        email: 'admin@bowoye.gn',
        password: adminPassword,
        role: 'admin',
        phone: '+224 000 000 000',
        address: 'Conakry, Guinée',
        isEmailVerified: true,
        isActive: true
      });
      console.log('✅ Administrateur créé !');
      console.log('📧 Email: admin@bowoye.gn');
      console.log('🔑 Mot de passe: admin123');
    }

    if (existingClient) {
      console.log('⚠️  Client existe déjà');
    } else {
      // Créer le client de test
      const clientPassword = await bcrypt.hash('password123', 12);
      await User.create({
        firstName: 'Client',
        lastName: 'Test',
        name: 'Client Test',
        email: 'client@bowoye.gn',
        password: clientPassword,
        role: 'user',
        phone: '+224 123 456 789',
        address: 'Conakry, Guinée',
        isEmailVerified: true,
        isActive: true
      });
      console.log('✅ Client de test créé !');
      console.log('📧 Email: client@bowoye.gn');
      console.log('🔑 Mot de passe: password123');
    }

    // Créer quelques clients supplémentaires
    const additionalClients = [
      {
        firstName: 'Mamadou',
        lastName: 'Diallo',
        name: 'Mamadou Diallo',
        email: 'mamadou@bowoye.gn',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        phone: '+224 111 222 333',
        address: 'Labé, Guinée',
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Fatou',
        lastName: 'Camara',
        name: 'Fatou Camara',
        email: 'fatou@bowoye.gn',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        phone: '+224 444 555 666',
        address: 'Kankan, Guinée',
        isEmailVerified: true,
        isActive: true
      }
    ];

    for (const client of additionalClients) {
      const existing = await User.findOne({ email: client.email });
      if (!existing) {
        await User.create(client);
        console.log(`✅ Client ${client.name} créé !`);
        console.log(`📧 Email: ${client.email}`);
        console.log(`🔑 Mot de passe: password123`);
      }
    }

    console.log('\n🎯 Utilisateurs de test créés avec succès !');
    console.log('\n📋 Comptes disponibles :');
    console.log('   👨‍💼 Admin: admin@bowoye.gn / admin123');
    console.log('   👤 Client: client@bowoye.gn / password123');
    console.log('   👤 Client: mamadou@bowoye.gn / password123');
    console.log('   👤 Client: fatou@bowoye.gn / password123');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter
connectDB().then(() => {
  createTestUsers();
});
