const mongoose = require('mongoose');

// Modèles de données
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

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

// Fonction pour diagnostiquer le dashboard
const diagnoseDashboard = async () => {
  try {
    console.log('\n🔍 DIAGNOSTIC DU TABLEAU DE BORD');
    console.log('=' * 60);

    // 1. Vérifier les utilisateurs
    const userCount = await User.countDocuments();
    const users = await User.find({});
    console.log(`\n👥 UTILISATEURS (${userCount}) :`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Rôle: ${user.role}`);
    });

    // 2. Vérifier les produits
    const productCount = await Product.countDocuments();
    const products = await Product.find({});
    console.log(`\n📦 PRODUITS (${productCount}) :`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - Prix: ${product.price} GNF - Stock: ${product.stock} - Catégorie: ${product.category}`);
    });

    // 3. Vérifier les commandes
    const orderCount = await Order.countDocuments();
    const orders = await Order.find({}).populate('userId', 'firstName lastName email');
    console.log(`\n🛒 COMMANDES (${orderCount}) :`);
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. Commande #${order._id}`);
      console.log(`      Client: ${order.userId?.firstName} ${order.userId?.lastName} (${order.userId?.email})`);
      console.log(`      Total: ${order.total} GNF`);
      console.log(`      Statut: ${order.status}`);
      console.log(`      Date: ${order.createdAt}`);
      console.log(`      Articles: ${order.items.length}`);
    });

    // 4. Statistiques du dashboard
    console.log(`\n📊 STATISTIQUES DU DASHBOARD :`);
    
    // Calculer les statistiques
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const averageOrderValue = orderCount > 0 ? totalRevenue[0]?.total / orderCount : 0;
    
    console.log(`   • Nombre total d'utilisateurs: ${userCount}`);
    console.log(`   • Nombre total de produits: ${productCount}`);
    console.log(`   • Nombre total de commandes: ${orderCount}`);
    console.log(`   • Chiffre d'affaires total: ${totalRevenue[0]?.total || 0} GNF`);
    console.log(`   • Valeur moyenne des commandes: ${averageOrderValue.toFixed(2)} GNF`);
    
    console.log(`   • Répartition des commandes par statut:`);
    ordersByStatus.forEach(status => {
      console.log(`     - ${status._id}: ${status.count}`);
    });

    // 5. Vérifier les données localStorage
    console.log(`\n💾 VÉRIFICATION DES DONNÉES LOCALSTORAGE :`);
    console.log(`   Les données du dashboard peuvent être stockées dans localStorage du navigateur.`);
    console.log(`   Ouvrez la console du navigateur (F12) et tapez :`);
    console.log(`   localStorage.getItem('dashboardData')`);

    // 6. Recommandations
    console.log(`\n💡 RECOMMANDATIONS :`);
    
    if (orderCount === 0) {
      console.log(`   ⚠️  Aucune commande trouvée. Vérifiez :`);
      console.log(`      - Que la commande a été créée avec succès`);
      console.log(`      - Que l'utilisateur est bien connecté`);
      console.log(`      - Que le processus de commande fonctionne`);
    }
    
    if (productCount === 0) {
      console.log(`   ⚠️  Aucun produit trouvé. Vérifiez :`);
      console.log(`      - Que les produits ont été créés avec succès`);
      console.log(`      - Que les données sont bien sauvegardées en base`);
    }
    
    if (orderCount > 0 && productCount > 0) {
      console.log(`   ✅ Données trouvées en base de données.`);
      console.log(`   Le problème peut venir de :`);
      console.log(`      - La synchronisation avec le frontend`);
      console.log(`      - Le cache du navigateur`);
      console.log(`      - Les requêtes API`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
};

// Fonction pour créer des données de test
const createTestData = async () => {
  try {
    console.log('\n🧪 CRÉATION DE DONNÉES DE TEST');
    console.log('=' * 40);

    // Créer un produit de test
    const testProduct = new Product({
      name: 'Produit Test Dashboard',
      description: 'Produit créé pour tester le dashboard',
      price: 50000,
      category: 'test',
      stock: 10,
      images: ['/images/test.jpg']
    });
    
    await testProduct.save();
    console.log(`✅ Produit test créé: ${testProduct.name}`);

    // Trouver un utilisateur pour créer une commande
    const user = await User.findOne({});
    if (user) {
      const testOrder = new Order({
        userId: user._id,
        items: [{
          productId: testProduct._id,
          quantity: 2,
          price: testProduct.price
        }],
        total: testProduct.price * 2,
        status: 'pending',
        shippingAddress: {
          street: 'Rue Test',
          city: 'Labé',
          postalCode: '001',
          country: 'Guinée'
        }
      });
      
      await testOrder.save();
      console.log(`✅ Commande test créée pour ${user.firstName} ${user.lastName}`);
    }

    console.log(`\n✅ Données de test créées avec succès !`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  }
};

// Fonction principale
const main = async () => {
  await connectDB();
  
  const command = process.argv[2];
  
  console.log('🔧 Diagnostic Dashboard - Bowoye Multi Services');
  console.log('=' * 60);
  
  switch (command) {
    case 'diagnose':
      await diagnoseDashboard();
      break;
      
    case 'test-data':
      await createTestData();
      break;
      
    case 'help':
    default:
      console.log('\n📖 Commandes disponibles :');
      console.log('   diagnose    - Diagnostiquer le tableau de bord');
      console.log('   test-data   - Créer des données de test');
      console.log('   help        - Afficher cette aide');
      break;
  }
  
  mongoose.connection.close();
  console.log('\n🔚 Connexion fermée');
};

// Exécuter le script
main().catch(console.error);
