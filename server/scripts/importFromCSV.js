const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/koula', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importFromCSV() {
  try {
    console.log('🔄 Début de l\'import depuis CSV...');
    
    // Vérifier si le fichier CSV existe
    const csvFile = 'products.csv';
    if (!fs.existsSync(csvFile)) {
      console.log('❌ Fichier products.csv non trouvé');
      console.log('📝 Création d\'un fichier d\'exemple...');
      
      // Créer un fichier CSV d'exemple
      const csvContent = `name,description,price,originalPrice,stock,category,image1,image2,featured,discountPercentage,spec1,spec2,spec3
Smartphone Samsung Galaxy A54,Smartphone Android avec écran 6.4 pouces,450000,500000,25,Électronique,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,true,10,Écran: 6.4 pouces,Stockage: 128GB,RAM: 6GB
Ordinateur Portable HP Pavilion,Laptop HP Pavilion 15 pouces,1200000,1350000,8,Informatique,https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500,,true,11,Processeur: Intel i5,RAM: 8GB,Stockage: 512GB SSD
Télévision LED 55 pouces,TV LED 55 pouces 4K Ultra HD,800000,900000,12,Électronique,https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500,,false,11,Taille: 55 pouces,Résolution: 4K,Smart TV: Android TV
Réfrigérateur 300L,Réfrigérateur 2 portes 300L,650000,700000,6,Électroménager,https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500,,false,7,Capacité: 300L,Type: 2 portes,Classe: A++
Machine à Laver 8kg,Lave-linge 8kg 1200 tours/min,450000,480000,10,Électroménager,https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500,,false,6,Capacité: 8kg,Vitesse: 1200 tours/min,Classe: A+++`;
      
      fs.writeFileSync(csvFile, csvContent);
      console.log('✅ Fichier products.csv créé avec des exemples');
      console.log('📝 Modifiez ce fichier avec vos produits et relancez le script');
      return;
    }
    
    // Récupérer les catégories existantes
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    const products = [];
    
    // Lire le fichier CSV
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        products.push(row);
      })
      .on('end', async () => {
        console.log(`📊 ${products.length} produits trouvés dans le CSV`);
        
        const createdProducts = [];
        
        for (const row of products) {
          try {
            // Trouver ou créer la catégorie
            let categoryId = categoryMap[row.category];
            
            if (!categoryId) {
              console.log(`📂 Création de la catégorie: ${row.category}`);
              const newCategory = new Category({
                name: row.category,
                description: `Catégorie ${row.category}`,
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
              });
              await newCategory.save();
              categoryMap[row.category] = newCategory._id;
              categoryId = newCategory._id;
            }
            
            // Préparer les images
            const images = [];
            if (row.image1) images.push({ url: row.image1 });
            if (row.image2) images.push({ url: row.image2 });
            
            // Préparer les spécifications
            const specifications = {};
            if (row.spec1) {
              const [key, value] = row.spec1.split(':');
              if (key && value) specifications[key.trim()] = value.trim();
            }
            if (row.spec2) {
              const [key, value] = row.spec2.split(':');
              if (key && value) specifications[key.trim()] = value.trim();
            }
            if (row.spec3) {
              const [key, value] = row.spec3.split(':');
              if (key && value) specifications[key.trim()] = value.trim();
            }
            
            // Créer le produit
            const product = new Product({
              name: row.name,
              description: row.description,
              price: parseInt(row.price),
              originalPrice: row.originalPrice ? parseInt(row.originalPrice) : parseInt(row.price),
              stock: parseInt(row.stock),
              category: categoryId,
              images: images,
              featured: row.featured === 'true',
              discountPercentage: row.discountPercentage ? parseInt(row.discountPercentage) : 0,
              specifications: specifications,
              rating: {
                average: Math.random() * 2 + 3, // Note entre 3 et 5
                count: Math.floor(Math.random() * 50) + 10 // Entre 10 et 60 avis
              }
            });
            
            const savedProduct = await product.save();
            createdProducts.push(savedProduct);
            
            console.log(`✅ Produit créé: ${savedProduct.name}`);
            
          } catch (error) {
            console.error(`❌ Erreur pour le produit ${row.name}:`, error.message);
          }
        }
        
        console.log(`\n🎉 Import terminé avec succès !`);
        console.log(`📦 ${createdProducts.length} produits importés`);
        
        // Afficher le résumé
        console.log('\n📋 Résumé des produits importés:');
        createdProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} - ${product.price.toLocaleString()} GNF (Stock: ${product.stock})`);
        });
        
        mongoose.connection.close();
      });
      
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    mongoose.connection.close();
  }
}

// Exécuter l'import
importFromCSV();
