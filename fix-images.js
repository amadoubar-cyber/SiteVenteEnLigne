// Script pour corriger les images des produits
const fs = require('fs');
const path = require('path');

console.log('🖼️ CORRECTION DES IMAGES DE PRODUITS');
console.log('====================================');

// Images de test variées et réalistes
const REALISTIC_IMAGES = {
  'ciment': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iI0VFRUVFRSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DSU1FTlQ8L3RleHQ+Cjwvc3ZnPgo=',
  
  'tuyau': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0iIzAwQ0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA5OUZGIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VFVZQVU8L3RleHQ+Cjwvc3ZnPgo=',
  
  'telephone': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cmVjdCB4PSIyMCIgeT0iMTUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI3MCIgcng9IjEwIiBmaWxsPSIjMzMzMzMzIi8+CiAgPHJlY3QgeD0iMjUiIHk9IjIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNjAiIHJ4PSI1IiBmaWxsPSIjMDAwMDAwIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI4NSIgcj0iMyIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TQU1TVU5HPC90ZXh0Pgo8L3N2Zz4K',
  
  'laptop': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cmVjdCB4PSIxNSIgeT0iMjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI1MCIgcng9IjMiIGZpbGw9IiMzMzMzMzMiLz4KICA8cmVjdCB4PSIyMCIgeT0iMjUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjIiIGZpbGw9IiMwMDAwMDAiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSI0IiBmaWxsPSIjNjY2NjY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhQPC90ZXh0Pgo8L3N2Zz4K',
  
  'placeholder': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0NDQ0NDQyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5PIE1BR0U8L3RleHQ+Cjwvc3ZnPgo='
};

// Fonction pour déterminer l'image appropriée selon le produit
function getProductImageByType(product) {
  const name = product.name.toLowerCase();
  const category = product.category?.toLowerCase() || '';
  const productType = product.productType?.toLowerCase() || '';
  
  // Matériaux de construction
  if (name.includes('ciment') || category.includes('ciment') || productType.includes('matériau')) {
    return REALISTIC_IMAGES.ciment;
  }
  
  if (name.includes('tuyau') || name.includes('pvc') || category.includes('plomberie')) {
    return REALISTIC_IMAGES.tuyau;
  }
  
  // Électronique
  if (name.includes('téléphone') || name.includes('samsung') || name.includes('galaxy') || category.includes('téléphone')) {
    return REALISTIC_IMAGES.telephone;
  }
  
  if (name.includes('laptop') || name.includes('ordinateur') || name.includes('hp') || category.includes('ordinateur')) {
    return REALISTIC_IMAGES.laptop;
  }
  
  // Par défaut
  return REALISTIC_IMAGES.placeholder;
}

try {
  // Lire le fichier adminProducts.json
  const filePath = path.join(__dirname, 'public', 'adminProducts.json');
  let products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log('1️⃣ Chargement des produits...');
  console.log(`   📦 ${products.length} produits trouvés`);
  
  // Mettre à jour les images
  console.log('\n2️⃣ Mise à jour des images...');
  let updatedCount = 0;
  
  products.forEach((product, index) => {
    const newImage = getProductImageByType(product);
    
    if (product.images && product.images.length > 0) {
      product.images[0].url = newImage;
    } else {
      product.images = [{ url: newImage }];
    }
    
    updatedCount++;
    console.log(`   ${index + 1}. ${product.name} → Image mise à jour`);
  });
  
  // Sauvegarder le fichier
  console.log('\n3️⃣ Sauvegarde des produits...');
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`   ✅ ${updatedCount} produits sauvegardés`);
  
  // Vérifier les images
  console.log('\n4️⃣ Vérification des images...');
  products.forEach((product, index) => {
    const imageUrl = product.images?.[0]?.url || 'Aucune image';
    const imageType = imageUrl.includes('CIMENT') ? 'Ciment' :
                     imageUrl.includes('TUVYAU') ? 'Tuyau' :
                     imageUrl.includes('SAMSUNG') ? 'Téléphone' :
                     imageUrl.includes('HP') ? 'Laptop' :
                     imageUrl.includes('NO IMAGE') ? 'Placeholder' : 'Inconnue';
    
    console.log(`   ${index + 1}. ${product.name} → ${imageType}`);
  });
  
  console.log('\n🎉 CORRECTION TERMINÉE !');
  console.log('Les images des produits ont été corrigées.');
  console.log('\n🔄 Instructions de test:');
  console.log('1. Rechargez la page (F5)');
  console.log('2. Allez dans "Électronique" pour voir les téléphones et laptops');
  console.log('3. Allez dans "Matériaux de Construction" pour voir les ciments et tuyaux');
  console.log('4. Vérifiez que les images sont différentes et appropriées');
  
} catch (error) {
  console.error('Erreur:', error.message);
}
