const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modèle utilisateur
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/koula-ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Fonction pour lister tous les utilisateurs
const listUsers = async () => {
  try {
    const users = await User.find({});
    console.log('\n📋 Liste de tous les utilisateurs :');
    console.log('=' * 60);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   Actif: ${user.isActive}`);
      console.log(`   Créé: ${user.createdAt}`);
      console.log('   ' + '-'.repeat(40));
    });
    
    return users;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    return [];
  }
};

// Fonction pour chercher un utilisateur par nom
const findUserByName = async (firstName, lastName) => {
  try {
    const user = await User.findOne({
      firstName: { $regex: new RegExp(firstName, 'i') },
      lastName: { $regex: new RegExp(lastName, 'i') }
    });
    
    if (user) {
      console.log('\n🔍 Utilisateur trouvé :');
      console.log(`   ID: ${user._id}`);
      console.log(`   Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle actuel: ${user.role}`);
      console.log(`   Actif: ${user.isActive}`);
    } else {
      console.log(`\n❌ Aucun utilisateur trouvé avec le nom "${firstName} ${lastName}"`);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    return null;
  }
};

// Fonction pour transformer un utilisateur en admin
const makeUserAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return false;
    }
    
    user.role = 'admin';
    await user.save();
    
    console.log('\n✅ Utilisateur transformé en admin avec succès !');
    console.log(`   Nom: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nouveau rôle: ${user.role}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
    return false;
  }
};

// Fonction pour créer un utilisateur admin
const createAdminUser = async (firstName, lastName, email, password) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Un utilisateur avec cet email existe déjà');
      return false;
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur admin
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    
    await newUser.save();
    
    console.log('\n✅ Utilisateur admin créé avec succès !');
    console.log(`   Nom: ${newUser.firstName} ${newUser.lastName}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Rôle: ${newUser.role}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    return false;
  }
};

// Fonction principale
const main = async () => {
  await connectDB();
  
  const command = process.argv[2];
  const param1 = process.argv[3];
  const param2 = process.argv[4];
  const param3 = process.argv[5];
  const param4 = process.argv[6];
  
  console.log('🔧 Gestionnaire d\'utilisateurs - Bowoye Multi Services');
  console.log('=' * 60);
  
  switch (command) {
    case 'list':
      await listUsers();
      break;
      
    case 'find':
      if (param1 && param2) {
        await findUserByName(param1, param2);
      } else {
        console.log('❌ Usage: node manage-users.js find <prénom> <nom>');
      }
      break;
      
    case 'make-admin':
      if (param1) {
        await makeUserAdmin(param1);
      } else {
        console.log('❌ Usage: node manage-users.js make-admin <user_id>');
      }
      break;
      
    case 'create-admin':
      if (param1 && param2 && param3 && param4) {
        await createAdminUser(param1, param2, param3, param4);
      } else {
        console.log('❌ Usage: node manage-users.js create-admin <prénom> <nom> <email> <mot_de_passe>');
      }
      break;
      
    case 'help':
    default:
      console.log('\n📖 Commandes disponibles :');
      console.log('   list                    - Lister tous les utilisateurs');
      console.log('   find <prénom> <nom>     - Chercher un utilisateur par nom');
      console.log('   make-admin <user_id>    - Transformer un utilisateur en admin');
      console.log('   create-admin <prénom> <nom> <email> <mot_de_passe> - Créer un admin');
      console.log('   help                    - Afficher cette aide');
      break;
  }
  
  mongoose.connection.close();
  console.log('\n🔚 Connexion fermée');
};

// Exécuter le script
main().catch(console.error);
