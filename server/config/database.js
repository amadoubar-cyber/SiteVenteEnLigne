const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Validation de l'URI MongoDB
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    console.log('Tentative de connexion à MongoDB...');
    
    // Connexion sans options dépréciées (Mongoose 6+)
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
