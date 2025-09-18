const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula_ecommerce');
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const checkProducts = async () => {
  try {
    console.log('🔍 Vérification des produits...\n');

    // Lister tous les produits
    const allProducts = await Product.find({});
    console.log(`📊 Total de produits: ${allProducts.length}\n`);

    if (allProducts.length === 0) {
      console.log('❌ Aucun produit trouvé dans la base de données');
      return;
    }

    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Prix: ${product.price} FG`);
      console.log(`   Catégorie: ${product.category}`);
      console.log(`   Type: ${product.productType}`);
      console.log(`   En stock: ${product.countInStock}`);
      console.log(`   Actif: ${product.isActive}`);
      console.log(`   En vedette: ${product.featured}`);
      console.log(`   Images: ${product.images ? product.images.length : 0}`);
      console.log(`   Créé le: ${product.createdAt}`);
      console.log('');
    });

    // Vérifier les produits actifs
    const activeProducts = await Product.find({ isActive: true });
    console.log(`✅ Produits actifs: ${activeProducts.length}`);

    // Vérifier les produits en vedette
    const featuredProducts = await Product.find({ featured: true });
    console.log(`⭐ Produits en vedette: ${featuredProducts.length}`);

    // Vérifier par catégorie
    const constructionProducts = await Product.find({ productType: 'construction' });
    const electronicsProducts = await Product.find({ productType: 'electronique' });
    
    console.log(`🏗️  Matériaux de construction: ${constructionProducts.length}`);
    console.log(`📱 Électronique: ${electronicsProducts.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la vérification
connectDB().then(() => {
  checkProducts();
});
