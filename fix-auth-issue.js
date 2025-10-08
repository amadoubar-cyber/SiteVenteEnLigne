/**
 * Script de diagnostic et correction des problèmes d'authentification
 * Vérifie et corrige les comptes utilisateurs dans la base de données
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modèle User (copié depuis votre serveur)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Fonction principale
async function fixAuthIssues() {
  try {
    console.log('🔍 Connexion à MongoDB...');
    
    // Connexion à MongoDB (utilise la même URI que votre serveur)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce';
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connecté à MongoDB');
    
    // 1. Lister tous les utilisateurs
    console.log('\n📊 DIAGNOSTIC DES UTILISATEURS:');
    const users = await User.find({});
    console.log(`Total d'utilisateurs trouvés: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Nom: ${user.name}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   Vérifié: ${user.isVerified}`);
      console.log(`   Créé: ${user.createdAt}`);
      console.log(`   Mot de passe hashé: ${user.password.substring(0, 20)}...`);
      console.log('---');
    });
    
    // 2. Vérifier les doublons d'emails
    console.log('\n🔍 VÉRIFICATION DES DOUBLONS:');
    const emailCounts = {};
    users.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
    });
    
    const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log('❌ Emails en doublon trouvés:');
      duplicates.forEach(([email, count]) => {
        console.log(`   ${email}: ${count} comptes`);
      });
    } else {
      console.log('✅ Aucun doublon d\'email trouvé');
    }
    
    // 3. Proposer des actions
    console.log('\n🛠️  ACTIONS POSSIBLES:');
    console.log('1. Nettoyer les comptes de test/doublons');
    console.log('2. Créer un compte admin fonctionnel');
    console.log('3. Réinitialiser tous les mots de passe');
    console.log('4. Vérifier la fonction de hash des mots de passe');
    
    // 4. Test de connexion avec un compte existant
    if (users.length > 0) {
      console.log('\n🧪 TEST DE HASH DES MOTS DE PASSE:');
      const testUser = users[0];
      console.log(`Test avec l'utilisateur: ${testUser.email}`);
      
      // Test avec des mots de passe communs
      const commonPasswords = ['123456', 'password', 'admin', 'test', 'bowoye', 'koula'];
      
      for (const testPassword of commonPasswords) {
        try {
          const isValid = await bcrypt.compare(testPassword, testUser.password);
          if (isValid) {
            console.log(`✅ Mot de passe trouvé: "${testPassword}"`);
            break;
          }
        } catch (error) {
          console.log(`❌ Erreur lors du test: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Fonction pour nettoyer la base de données
async function cleanDatabase() {
  try {
    console.log('🧹 NETTOYAGE DE LA BASE DE DONNÉES...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce';
    await mongoose.connect(mongoURI);
    
    // Supprimer les comptes de test
    const testEmails = ['test@test.com', 'admin@test.com', 'demo@demo.com'];
    const deletedUsers = await User.deleteMany({ email: { $in: testEmails } });
    console.log(`✅ ${deletedUsers.deletedCount} comptes de test supprimés`);
    
    // Supprimer les comptes non vérifiés anciens (> 7 jours)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deletedUnverified = await User.deleteMany({ 
      isVerified: false, 
      createdAt: { $lt: sevenDaysAgo } 
    });
    console.log(`✅ ${deletedUnverified.deletedCount} comptes non vérifiés anciens supprimés`);
    
    // Créer un compte admin fonctionnel
    const adminEmail = 'admin@bowoye.com';
    const adminPassword = 'admin123';
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: 'Administrateur Bowoye',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      
      await newAdmin.save();
      console.log(`✅ Compte admin créé: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`ℹ️  Compte admin existe déjà: ${adminEmail}`);
    }
    
    // Créer un compte utilisateur de test
    const testEmail = 'client@bowoye.com';
    const testPassword = 'client123';
    
    const existingUser = await User.findOne({ email: testEmail });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const newUser = new User({
        name: 'Client Test',
        email: testEmail,
        password: hashedPassword,
        role: 'user',
        isVerified: true
      });
      
      await newUser.save();
      console.log(`✅ Compte client créé: ${testEmail} / ${testPassword}`);
    } else {
      console.log(`ℹ️  Compte client existe déjà: ${testEmail}`);
    }
    
    console.log('\n✅ Nettoyage terminé !');
    console.log('\n📋 COMPTES DISPONIBLES:');
    console.log('Admin: admin@bowoye.com / admin123');
    console.log('Client: client@bowoye.com / client123');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Exécution selon l'argument
const action = process.argv[2];

if (action === 'clean') {
  cleanDatabase();
} else {
  fixAuthIssues();
}

module.exports = { fixAuthIssues, cleanDatabase };
